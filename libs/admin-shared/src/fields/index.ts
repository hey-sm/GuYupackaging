import financialFinancialApply from './financial/financialApply.json'
import financialFinancileBillCheck from './financial/financileBillCheck.json'
import flowManagermentCarbonCopy from './flowManagerment/carbonCopy.json'
import informationGoodsInfoGx from './information/goodsInfoGx.json'
import informationGoodsInfoParts from './information/goodsInfoParts.json'
import informationGoodsVehiclelInfo from './information/goodsVehiclelInfo.json'
import informationHrlist from './information/hrlist.json'
import informationMerchantEquipment from './information/merchantEquipment.json'
import informationMerchantGroup from './information/merchantGroup.json'
import informationSapCarTypeInfo from './information/sapCarTypeInfo.json'
import informationSapCategoryInfo from './information/sapCategoryInfo.json'
import informationSapColorInfo from './information/sapColorInfo.json'
import informationSapDistributionChannelInfos from './information/sapDistributionChannelInfos.json'
import informationSapOptionalInfo from './information/sapOptionalInfo.json'
import informationSapProductCategoryInfo from './information/sapProductCategoryInfo.json'
import informationSapStrainInfo from './information/sapStrainInfo.json'
import informationStoreTypeInfo from './information/storeTypeInfo.json'
import informationSysArea from './information/sysArea.json'
import informationSysEmployee from './information/sysEmployee.json'
import informationSysEmployees from './information/sysEmployees.json'
import informationSysOrganization from './information/sysOrganization.json'
import informationSysPost from './information/sysPost.json'
import informationSysRole from './information/sysRole.json'
import inventoryAnalyze from './inventory/analyze.json'
import inventoryManagerment from './inventory/managerment.json'
import inventoryWarehouseIn from './inventory/warehouseIn.json'
import inventoryWarehouseOut from './inventory/warehouseOut.json'
import managerFlowRunTaskReceive from './manager/flowRunTaskReceive.json'
import managerNoticeInfo from './manager/noticeInfo.json'
import managerNoticeInfoRead from './manager/noticeInfoRead.json'
import memberMemberInfo from './member/memberInfo.json'
import merchantOneAccountApply from './merchantOne/accountApply.json'
import merchantOneArchives from './merchantOne/archives.json'
import merchantOneExitNet from './merchantOne/exitNet.json'
import merchantOneFreezeOrthaw from './merchantOne/freezeOrthaw.json'
import merchantOneReimbursement from './merchantOne/reimbursement.json'
import merchantOneScopeChange from './merchantOne/scopeChange.json'
import merchantOneStoreCreateApply from './merchantOne/storeCreateApply.json'
import merchantOneUploadSAP from './merchantOne/uploadSAP.json'
import merchantStoreStoreInfo from './merchantStore/storeInfo.json'
import merchantTwoMerchantCanalAudit from './merchantTwo/merchantCanalAudit.json'
import merchantTwoMerchantInfo from './merchantTwo/merchantInfo.json'
import orderFullCarOrder from './order/fullCarOrder.json'
import orderGxOrder from './order/gxOrder.json'
import orderOrderChangeInfo from './order/orderChangeInfo.json'
import orderOrderDeliveryInfo from './order/orderDeliveryInfo.json'
import orderOrderFeedbackInfo from './order/orderFeedbackInfo.json'
import orderPartsOrder from './order/partsOrder.json'
import systemManagement from './systemManagerment/sysAccount.json'

interface IModuleFields {
  [ke: string]: any
}

export const fields:IModuleFields = {
  orderFullCarOrder,
  informationSapCategoryInfo,
  informationSapStrainInfo,
  informationSapCarTypeInfo,
  informationSapProductCategoryInfo,
  orderOrderDeliveryInfo,
  orderOrderChangeInfo,
  orderOrderFeedbackInfo,
  informationSapDistributionChannelInfos,
  orderGxOrder,
  memberMemberInfo,
  informationSapColorInfo,
  informationSysArea,
  informationSapOptionalInfo,
  informationSysRole,
  orderPartsOrder,
  informationStoreTypeInfo,
  informationSysOrganization,
  informationMerchantGroup,
  informationGoodsVehiclelInfo,
  informationMerchantEquipment,
  informationGoodsInfoParts,
  systemManagement,
  merchantStoreStoreInfo,
  informationGoodsInfoGx,
  merchantTwoMerchantCanalAudit,
  merchantTwoMerchantInfo,
  merchantOneArchives,
  merchantOneAccountApply,
  merchantOneStoreCreateApply,
  merchantOneUploadSAP,
  merchantOneReimbursement,
  merchantOneScopeChange,
  merchantOneFreezeOrthaw,
  merchantOneExitNet,
  financialFinancileBillCheck,
  financialFinancialApply,
  managerNoticeInfo,
  managerNoticeInfoRead,
  managerFlowRunTaskReceive,
  informationSysEmployee,
  informationSysPost,
  informationHrlist,
  inventoryManagerment,
  flowManagermentCarbonCopy,
  inventoryWarehouseIn,
  inventoryWarehouseOut,
  inventoryAnalyze,
  informationSysEmployees,
}

