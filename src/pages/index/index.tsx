import {Button, Image, View} from '@tarojs/components'
import './index.less'
import LunarCalendar from 'lunar-calendar'
import moment from 'moment'
import {useEffect, useState} from "react";
import Taro, {onAppShow, request, useDidShow, useShareAppMessage} from "@tarojs/taro";
import WechatIMG195Jpeg from '../img/WechatIMG195.jpeg'

const Index = () =>{
  console.log(process.env.NODE_ENV,process.env.HOST)
  const weeks = ['一','二','三','四','五','六','日']
  console.log(moment().year(),moment().month() + 1,moment().date(),moment().format('E'))

  const [imgUrl,setImgUrl] = useState('')

  const date = moment().date()
  console.log(LunarCalendar.calendar(2022,1).monthData[date - 1],'LunarCalendar')

  const lcObj = LunarCalendar.calendar(2022,1).monthData[date - 1]


  const [baseData,setBaseData] = useState<any>({
    date: moment().format('MM/DD'),
    week: `星期${weeks[(moment().format('E') - 1)]}`,
    lunarMonthDayName: `${lcObj.lunarMonthName}${lcObj.lunarDayName}`
  })


  const [roData,setRoData] = useState({
    proposal: '',
    content: '',
    from: '',
    profession: '',
    author: '',
    authorOriginName: '',
    roData:'#000000'
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

  function genUrl(f: any): string {
    const { storageKey } = f
    const { postfix } = f
    return `http://public-api.rico.org.cn/${storageKey}.${postfix}`
  }

  useDidShow(() => {
    request({url:'https://www.api.rico.org.cn/qingkong/calendar/ow',data:{t:Math.random()}}).then(res=>{
      console.log(res.data)
      const params = {
        label:String(res.data.id),
        bucket:'qingkong-home'
      }
      request({url:'https://www.api.rico.org.cn/public-api/file/list',method:'POST',data:params}).then(resx=>{
        console.log(resx.data[0],12345)
        setImgUrl(genUrl(resx.data[0]))
      })

      setRoData(res.data)
    })
  })

  return (
    <View className='home'>
      <View className='date'>{baseData.date}</View>

      {/*<Image src={WechatIMG195Jpeg} />*/}

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



      <View className='bg-img' style={{backgroundImage:`url(${imgUrl})`,color: roData.background}}>
        <View className='content'>
          <View className='title'>{roData.proposal}</View>
          <View className='desc'>{roData.content}</View>
          <View className='chuchu'>{roData.from}</View>
        </View>


        <View className='bottom'>
          <View className='baixian'></View>
          <View className='zuozhe'>{roData.profession}，{roData.author}</View>
          <View className='en-name'>{roData.authorOriginName}</View>
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
