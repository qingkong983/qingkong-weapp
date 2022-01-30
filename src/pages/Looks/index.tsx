import {Button, Image, Text, View} from '@tarojs/components'
import './index.less'
import {useEffect, useState} from "react";
import {request} from "../../utils/request";
import {config} from "../../config";
const baseUrl = config.baseUrl
const Index = () =>{
  const [punchers,setPunchers] = useState([])
  useEffect(()=>{
    request({url:`${baseUrl}/punch/todayPunch`,method:'POST'}).then(resxc=>{
      console.log(resxc)
      setPunchers(resxc)
    })
  },[])

  return <View className={'looks'}>
    {
      punchers.map(item=>{


        return (
          <View className={'looks-item'}>
            <View className={'left'}>
              <Image src={item.puncherAvatarUrl}></Image>
              <Text>{item.puncherNickName}</Text>
            </View>
            <Text>{item.puncherTime}</Text>
          </View>
        )
      })
    }

  </View>
}


export default Index
