import { Schema, model } from 'mongoose';

interface IProducts {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: { rate: number; count: number };
  title: string;
  isAddedToWishlist: boolean;
  isAddedToCart: boolean;
  quantity: number;
}

const productsModel = new Schema<IProducts>({
  category: String,
  description: String,
  id: Number,
  image: String,
  price: Number,
  rating: {
    rate: Number,
    count: Number,
  },
  title: String,
  isAddedToWishlist: Boolean,
  isAddedToCart: Boolean,
  quantity: Number,
});

const Product = model<IProducts>('Product', productsModel);

export default Product;
