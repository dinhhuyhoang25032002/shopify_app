import { ShopModel } from '@/models/shop.model'
import { handleFetchApi } from './handleFetchApi'
import { RuleModel } from '@/models/rule.model'
import util from 'util'
export const handlePushMetafield = async (url: string) => {
  const domain = new URL(url).hostname

  const [shop, rules] = await Promise.all([
    ShopModel.findOne({ where: { shop: domain }, raw: true }),
    RuleModel.findAll({ raw: true })
  ])
  console.log('shop', shop)

  const rulesList = rules.map((r) => ({
    id: r.id,
    name: r.name,
    status: r.status,
    apply: r.apply,
    value: r.value,
    type: r.type,
    priority: r.priority,
    tags: r.tags ? JSON.parse(r.tags as string) : []
  }))

  const value = JSON.stringify(rulesList)

  const query = {
    query: `query {
        currentAppInstallation {
        id
      }
    }`
  }

  const res = await handleFetchApi({ url, shop }, query)

  console.log(util.inspect(res, false, null, true /* enable colors */))
  const idApp = res.data.currentAppInstallation.id
  const queryPush = {
    query: `mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafieldsSetInput) {
        metafields {
          id
          namespace
          key
          value
        }
        userErrors {
          field
          message
        }
      }
    }`,
    variables: {
      metafieldsSetInput: [
        {
          namespace: 'rule_list',
          key: 'product_rule',
          type: 'json',
          value: value,
          ownerId: idApp
        }
      ]
    }
  }
  const pushMetaData = await handleFetchApi({ url, shop }, queryPush)
  console.log(util.inspect(pushMetaData, false, null, true /* enable colors */))
  return pushMetaData.data.metafieldsSet.metafields.length
}
