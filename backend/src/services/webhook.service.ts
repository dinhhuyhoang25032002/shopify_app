import { ShopModel } from '@/models/shop.model'
import sequelize from '@/database'
export const handleUpdateShopInfoWh = async (body: { email: string; domain: string }) => {
  try {
    const { email, domain } = body
    const [affectedRows] = await ShopModel.update({ email }, { where: { shop: domain } })
    return affectedRows > 0
  } catch (error) {
    console.log(error)
  }
}
export const handleUpdateShopStatusWh = async (body: { domain: string }) => {
  try {
    const { domain } = body
    console.log('domain', domain)

    const query = `DELETE FROM shopify_sessions WHERE shop = :domain`
    const [result] = await sequelize.query(query, { replacements: { domain } })
    console.log('testRawQuery', result)

    await ShopModel.update({ status: 0 }, { where: { shop: domain } })
  } catch (error) {
    console.log(error)
  }
}
