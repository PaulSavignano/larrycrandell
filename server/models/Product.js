import mongoose, { Schema } from 'mongoose'

import { uploadFile, deleteFile } from '../middleware/s3'

const s3Path = `${process.env.APP_NAME}/products/product_`

const ProductSchema = new Schema({
  pageId: { type: Schema.Types.ObjectId, ref: 'Page' },
  pageSlug: { type: String },
  productSlug: { type: String },
  sectionId: { type: Schema.Types.ObjectId, ref: 'Section' },
  values: {
    description: { type: String, minlength: 1, trim: true },
    detail: { type: String },
    flex: { type: String, trim: true, default: '1 1 auto' },
    margin: { type: String, trim: true, default: '16px' },
    name: { type: String, minlength: 1, trim: true },
    price: { type: Number, default: 0 },
    width: { type: String, trim: true, default: '300px' }
  },
  image: {
    src: { type: String, minlength: 1, trim: true },
    width: { type: Number, trim: true, default: 1012 },
    height: { type: Number, trim: true, default: 675 }
  },
  slug: { type: String },
}, {
  timestamps: true
})

ProductSchema.pre('remove', function(next) {
  const product = this
  if (product.image && product.image.src) {
    deleteFile({ Key: product.image.src }).catch(err => console.error(err))
  }
  next()
})

const Product = mongoose.model('Product', ProductSchema)

export default Product
