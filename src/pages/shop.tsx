import { AiOutlineShoppingCart } from "react-icons/ai";
import { NOTIFICATION } from "styles";

const ShopItem = ({ shop }: any) => {
  return (
    <div className="max-w-[50%] mt-10 bg-white p-4 mx-auto rounded-xl">
      <div className="flex justify-center">
        <img src={shop.image} />
      </div>
      <h1 className="my-2">{shop.title}</h1>
      <div className="flex justify-between items-center">
        <p className="font-semibold">{shop.price}</p>
        <div>
          <AiOutlineShoppingCart />
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const res = await fetch("https://sadykhan.up.railway.app/");
  const shop = await res.json();

  return {
    props: {
      shop,
    },
  };
}

const Shop = ({ shop }: any) => {
  return (
    <>
      <h1 className={`${NOTIFICATION} mt-0 text-center`}>
        Магазин, в котором доступны товары по доступным ценам!
      </h1>
      <div className="grid md:grid-cols-3 grid-cols-1">
        {shop.map((s: any) => (
          <ShopItem key={s.shop} shop={s} />
        ))}
      </div>
    </>
  );
};

export default Shop;
