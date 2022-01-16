import {Button, View} from '@tarojs/components'
import './index.less'
import LunarCalendar from 'lunar-calendar'
import moment from 'moment'
import {useEffect, useState} from "react";
import Taro, {onAppShow, request, useDidShow, useShareAppMessage} from "@tarojs/taro";

const Index = () =>{
  console.log(process.env.NODE_ENV,process.env.HOST)
  const weeks = ['一','二','三','四','五','六','日']
  console.log(moment().year(),moment().month() + 1,moment().date(),moment().format('E'))

  const date = moment().date()
  console.log(LunarCalendar.calendar(2022,1).monthData[date - 1],'LunarCalendar')

  const lcObj = LunarCalendar.calendar(2022,1).monthData[date - 1]


  const [baseData,setBaseData] = useState<any>({
    date: moment().format('MM/DD'),
    week: `星期${weeks[(moment().format('E') - 1)]}`,
    lunarMonthDayName: `${lcObj.lunarMonthName}${lcObj.lunarDayName}`
  })


  const [roData,setRoData] = useState({
    suggestion: '忌伪善',
    content: '蚜虫吃青草，锈吃铁，虚伪吃灵魂。',
    from: '《我的一生》',
    profession: '作家',
    name: '安东·巴普洛维奇·契诃夫',
    originName: 'Антон Павлович Чехов',
  })


  console.log(baseData,'baseData')


  useShareAppMessage(res => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '单向历',
      path: '/pages/index/index'
    }
  })

  useDidShow(() => {
    request({url:'https://www.api.rico.org.cn/ow-calendar-api/ow',data:{t:Math.random()}}).then(res=>{
      setRoData(res.data)
    })
  })

  return (
    <View className='home'>
      <View className='date'>{baseData.date}</View>


      <View className='date-detail'>
        <View className='l'>
          <View className='yuan'></View>
          <View>{baseData.week} 农历 {baseData.lunarMonthDayName}</View>
        </View>


        <View className='r'>
          <View>{lcObj.GanZhiYear} 【{lcObj.zodiac}年】{lcObj.GanZhiMonth}月{lcObj.GanZhiDay}日</View>
          <View></View>
        </View>
      </View>



      <View className='bg-img'>
        <View className='content'>
          <View className='title'>{roData.suggestion}</View>
          <View className='desc'>{roData.content}</View>
          <View className='chuchu'>{roData.from}</View>
        </View>


        <View className='bottom'>
          <View className='baixian'></View>
          <View className='zuozhe'>{roData.profession}，{roData.name}</View>
          <View className='en-name'>{roData.originName}</View>
        </View>
      </View>


      <View className='operate'>
        <Button className='btn' openType='share'>分享</Button>
        {/*<View className={'btn'}>发布微信状态</View>*/}
      </View>

    </View>
  )
}


export default Index
