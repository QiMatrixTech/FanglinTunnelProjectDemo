import { createRouter, createWebHistory } from 'vue-router'

import MainPageComponent from '@/pages/MainBoardPage/components/MainPage/MainPageComponent.vue'
import MainPageSettingComponent from '@/pages/MainBoardPage/components/MainPageSetting/MainPageSettingComponent.vue'
import UserListComponent from '@/pages/MainBoardPage/components/UserList/UserListComponent.vue'
import RoleListComponent from '@/pages/MainBoardPage/components/RoleList/RoleListComponent.vue'
import PermissionListComponent from '@/pages/MainBoardPage/components/PermissionList/PermissionListComponent.vue'
import SensorManageComponent from '@/pages/MainBoardPage/components/SesorManage/SensorManageComponent.vue'
import TempHumidMonitorComponent from '@/pages/MainBoardPage/components/Monitors/TempHumidMonitor/TempHumidMonitorComponent.vue'
import StructureTempMonitorComponent from '@/pages/MainBoardPage/components/Monitors/StructureTempMonitor/StructureTempMonitorComponent.vue'
import StructureStrainMonitorComponent from '@/pages/MainBoardPage/components/Monitors/StructuralStrainMonitor/StructureStrainMonitorComponent.vue'
import WaterAccumulationMonitorComponent from '@/pages/MainBoardPage/components/Monitors/WaterAccumulationMonitor/WaterAccumulationMonitorComponent.vue'
import DeformationJointDisplacement from '@/pages/MainBoardPage/components/Monitors/DeformationJointDisplacement/DeformationJointDisplacement.vue'
import SegementalSettlementComponent from '@/pages/MainBoardPage/components/Monitors/SegmentalSettlement/SegementalSettlementComponent.vue'
import AirQualityMonitorComponent from '@/pages/MainBoardPage/components/Monitors/AirQualityMonitor/AirQualityMonitorComponent.vue'

import SensorValueAlertComponent from '@/pages/MainBoardPage/components/Alerts/SensorValueAlert/SensorValueAlertComponent.vue'
import SensorOnOffLineAlertComponent from '@/pages/MainBoardPage/components/Alerts/SensorOnOffLineAlert/SensorOnOffLineAlertComponent.vue'
import SensorThreholdSettingComponent from '@/pages/MainBoardPage/components/Alerts/SensorThreholdSetting/SensorThreholdSettingComponent.vue'

import TempHumidAnalysisComponent from '@/pages/MainBoardPage/components/Analysis/TempHumidAnalysis/TempHumidAnalysisComponent.vue'
import StructureTempAnalysisComponent from '@/pages/MainBoardPage/components/Analysis/StructureTempAnalysis/StructureTempAnalysisComponent.vue'
const routes = [
  {
    path: '/',
    component: MainPageComponent,
  },
  {
    path: '/settings/homesetting',
    component: MainPageSettingComponent,
  },
  {
    path: '/user/list',
    component: UserListComponent,
  },
  {
    path: '/user/roles',
    component: RoleListComponent,
  },
  {
    path: '/user/permissions',
    component: PermissionListComponent,
  },
  {
    path: '/sensors',
    component: SensorManageComponent,
  },
  {
    path: '/monitor/temp',
    component: TempHumidMonitorComponent,
  },
  {
    path: '/monitor/structure-temp',
    component: StructureTempMonitorComponent,
  },
  {
    path: '/monitor/strain',
    component: StructureStrainMonitorComponent,
  },
  {
    path: '/monitor/water',
    component: WaterAccumulationMonitorComponent,
  },
  {
    path: '/monitor/expansion',
    component: DeformationJointDisplacement,
  },
  {
    path: '/monitor/settlement',
    component: SegementalSettlementComponent,
  },
  {
    path: '/monitor/air',
    component: AirQualityMonitorComponent,
  },
  {
    path: '/alerts/sensor-value',
    component: SensorValueAlertComponent,
  },
  {
    path: '/alerts/sensor-onoffline',
    component: SensorOnOffLineAlertComponent,
  },
  {
    path: '/alerts/sensor-threshold-settings',
    component: SensorThreholdSettingComponent,
  },
  {
    path: '/analysis/temp',
    component: TempHumidAnalysisComponent,
  },
  {
    path: '/analysis/structure-temp',
    component: StructureTempAnalysisComponent,
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
