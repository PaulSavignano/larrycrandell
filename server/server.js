import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'

import Brand from './models/Brand'

Brand.findOne({})
  .then(doc => !doc && new Brand({}).save())
  .catch(err => console.error(err))

import mongoose from './db/mongoose'
import brands from './routes/brands'
import buttons from './routes/buttons'
import cards from './routes/cards'
import carts from './routes/carts'
import iframes from './routes/iframes'
import images from './routes/images'
import orders from './routes/orders'
import pages from './routes/pages'
import products from './routes/products'
import sections from './routes/sections'
import slides from './routes/slides'
import texts from './routes/texts'
import titles from './routes/titles'
import users from './routes/users'


const app = express()
const port = process.env.PORT

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/brands', brands)
app.use('/api/buttons', buttons)
app.use('/api/cards', cards)
app.use('/api/carts', carts)
app.use('/api/iframes', iframes)
app.use('/api/images', images)
app.use('/api/orders', orders)
app.use('/api/pages', pages)
app.use('/api/products', products)
app.use('/api/sections', sections)
app.use('/api/slides', slides)
app.use('/api/texts', texts)
app.use('/api/titles', titles)
app.use('/api/users', users)

const staticFiles = express.static(path.join(__dirname, '../../client/build'))
app.use(staticFiles)

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'))
})


app.listen(port, () => console.log(`Started up at port: ${port}`))

export default app
