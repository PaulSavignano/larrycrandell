import express from 'express'
import { ObjectID } from 'mongodb'

import authenticate from '../middleware/authenticate'
import { uploadFile, deleteFile, deleteFiles } from '../middleware/s3'
import Section from '../models/Section'
import Card from '../models/Card'
import Product from '../models/Product'
import Slide from '../models/Slide'

const sections = express.Router()

const s3Path = `${process.env.APP_NAME}/sections/section_`

// Create
sections.post('/', authenticate(['admin']), (req, res) => {
  const { pageId, slug } = req.body
  const section = new Section({
    pageId: ObjectID(pageId),
    slug
  })
  section.save()
    .then(doc => res.send(doc))
    .catch(err => {
      console.error(err)
      res.status(400).send()
    })
})



// Read
sections.get('/', (req, res) => {
  Section.find({})
    .then(docs => res.send(docs))
    .catch(err => {
      console.error(err)
      res.status(400).send()
    })
})

sections.get('/:_id', (req, res) => {
  const _id = req.params._id
  Section.find({ _id })
    .then(doc => res.send(doc))
    .catch(err => {
      console.error(err)
      res.status(400).send()
    })
})



// Update
sections.patch('/:_id', authenticate(['admin']), (req, res) => {
  const _id = req.params._id
  if (!ObjectID.isValid(_id)) return res.status(404).send()
  const { componentId, type, pageId, image, values } = req.body
  const Key = `${s3Path}${_id}`
  switch (type) {

    case 'UPDATE_IMAGE_AND_VALUES':
      uploadFile({ Key }, image.src)
        .then(data => {
          const update = {
            image: {
              src: data.Location,
              width: image.width,
              height: image.height
            },
            values
          }
          Section.findOneAndUpdate({ _id }, { $set: update }, { new: true })
            .then(doc => res.send(doc))
            .catch(err => {
              console.error(err)
              res.status(400).send()
            })
          .catch(err => {
            console.error(err)
            res.status(400).send()
          })
        })
      break

    case 'DELETE_IMAGE':
      deleteFile({ Key })
        .then(() => {
          Section.findOneAndUpdate({ _id }, { $set: { 'appBar.image.src': null }}, { new: true })
            .then(doc => {
              res.send(doc)
            })
            .catch(err => {
              console.error(err)
              res.status(400).send()
            })
          .catch(err => {
            console.error(err)
            res.status(400).send()
          })
        })
      break

    case 'UPDATE_VALUES':
      Section.findOneAndUpdate({ _id }, { $set: { values }}, { new: true })
        .then(doc => {
          res.send(doc)
        })
        .catch(err => {
          console.error(err)
          res.status(400).send()
        })
      break

    case 'ADD_CONTACT_FORM':
      Section.findOneAndUpdate({ _id }, {
        $push: {
          components: {
            componentId: new ObjectID(),
            type: 'Contact'
          }
        }
      }, { new: true })
        .then(doc => res.send(doc))
        .catch(err => {
          console.error(err)
          res.status(400).send()
        })
      break

    case 'DELETE_CONTACT_FORM':
      Section.findOneAndUpdate({ _id }, {
        $pull: {
          components: {
            componentId,
          }
        }
      }, { new: true })
        .then(doc => res.send(doc))
        .catch(err => {
          console.error(err)
          res.status(400).send()
        })
      break

    default:
      return
  }
})





// Delete
sections.delete('/:_id', authenticate(['admin']), (req, res) => {
  const _id = req.params._id
  if (!ObjectID.isValid(_id)) return res.status(404).send()
  Section.findOne({ _id })
    .then(section => {
      section.remove()
        .then(section => {
          res.send(section)
        })
        .catch(err => {
          console.error(err)
          res.status(400).send()
        })
    })
    .catch(err => {
      console.error(err)
      res.status(400).send()
    })
})



export default sections
