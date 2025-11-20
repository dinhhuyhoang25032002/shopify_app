import { ShopDto } from 'src/dto/shop.dto.js'
import { ShopModel } from 'src/models/shop.model'

export const handleUpdateShopInfo = async (shopId: string, body: Partial<ShopDto>): Promise<boolean> => {
  const [affectedRows] = await ShopModel.update(body, {
    where: { shop: shopId } // nếu muốn update theo id, dùng { id: shopId }
  })

  return affectedRows > 0
}

export const handleCreateShop = async (body: ShopDto) => {
  const { shop } = body
  const shopData = await ShopModel.findOne({
    where: {
      shop: shop
    }
  })

  if (!shopData) {
    return ShopModel.create(body, { raw: true })
  } else {
    return shopData.update({ status: 1 }, { raw: true, returning: true })
  }
}

export const deleteShopById = async (shopId: string): Promise<boolean> => {
  const affectedRows = await ShopModel.destroy({
    where: { shop: shopId } // nếu muốn dùng id, chuyển thành { id: shopId }
  })

  return affectedRows > 0
}
