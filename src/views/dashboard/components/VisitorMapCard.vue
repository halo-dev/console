<template>
  <a-card title="访客地图" :loading="loading" :body-style="{ padding: '20px 24px' }" :bordered="false">
    <div ref="container" style="height: 308px; width: 100%;"></div>
    <a-tooltip placement="bottomLeft" slot="extra">
      <template slot="title">
        <span>近一年访问量的统计</span>
      </template>
      <a href="javascript:void(0);">
        <a-icon type="info-circle-o" />
      </a>
    </a-tooltip>
  </a-card>
</template>
<script>
import echarts from 'echarts'
import mapInfo from './map/info'
import 'echarts/map/js/world.js'
import 'echarts/map/js/china.js'

import visitLogApi from '@/api/visitorLog'

export default {
  name: 'VisitorMapCard',
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      startNumber: 0,
      mapData: [],
      countries: mapInfo.countries,
      provinces: mapInfo.provinces,
      translate: mapInfo.translate,
      charts: null,
      worldMap: true,
      dataList: []
    }
  },
  created() {
    this.initDataList()
    this.loadDataList()
  },
  methods: {
    initDataList() {
      for (const country of this.countries) {
        this.dataList.push({
          'name': country,
          'value': 0
        })
      }
      for (const province of this.provinces) {
        this.dataList.push({
          'name': province,
          'value': 0
        })
      }
    },
    loadDataList() {
      visitLogApi.getVisitsByRegion().then(response => {
        const data = response.data.data
        var countByCountry = data.countByCountry
        const countByProvince = data.countByProvince
        countByCountry = countByCountry.map(item => {
          item.region = this.translate[item.region]
          return item
        })
        countByCountry.forEach(itemOne => {
          var temp = this.dataList.find(itemTwo => itemTwo.name === itemOne.region)
          if (temp) {
            temp.value = itemOne.count
          }
        })
        countByProvince.forEach(itemOne => {
          var temp = this.dataList.find(itemTwo => itemTwo.name === itemOne.region)
          if (temp) {
            temp.value = itemOne.count
          }
        })
        this.charts.setOption({
          series: [
            {
              name: '访问量',
              type: 'map',
              geoIndex: 0,
              data: this.dataList
            }
          ]
        })
      })
    }
  },
  mounted() {
    this.charts = echarts.init(this.$refs.container)
    const charts = this.charts
    const that = this
    this.charts.setOption({
      tooltip: {
        formatter: (params, ticket, callback) => {
          return params.seriesName + '<br />' + params.name + '：' + (isNaN(params.value) ? 0 : params.value)
        }
      },
      visualMap: {
        min: 0,
        max: 100,
        left: 'left',
        top: 'bottom',
        inRange: {
          color: ['#f8f8f8', '#8facd2', '#5782bb', '#74add1', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#e26963']
        },
        show: true,
        itemWidth: 8,
        itemHeight: 80
      },
      toolbox: {
        show: true,
        right: '15px',
        top: 'top',
        feature: {
          myTool1: {
            show: false,
            title: '返回世界地图',
            icon:
              '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M175 75C171.562 66.8945 169.25 63.2695 163 57C156.75 50.7305 150.605 45.9375 142.5 42.5C134.102 38.9258 125.672 37.5 116.492 37.5H72H28.25L49.168 12.5938C50.6914 11.0703 50.6914 11.5234 49.168 10C47.6446 8.47656 48.5234 8.47656 47 10L23 39C23 37.6133 23 40.5 23 39C23 40.3672 23 39 23 40L47 65C48.5234 66.5234 48.4766 66.5234 50 65C51.5234 63.4766 50.6914 63.7656 49.168 62.2422L28.25 41.3242H116.492C149.773 41.3242 176.844 68.3945 176.844 101.676C176.844 134.957 149.773 162.027 116.492 162.027H55.8086C53.6602 162.027 53.5 162.352 53.5 164.5C53.5 166.648 53.6602 166.5 55.8086 166.5H86H116.492C125.652 166.5 133.582 164.574 142 161C150.105 157.562 156.23 152.75 162.5 146.5C168.77 140.23 172.562 135.605 176 127.5C179.574 119.102 180.5 110.855 180.5 101.676C180.5 92.4961 178.574 83.418 175 75Z" fill="#707070"/></svg>',
            onclick: function() {
              charts.setOption({
                geo: {
                  map: 'world',
                  zoom: 1.25,
                  center: [2, 12]
                },
                toolbox: {
                  feature: {
                    myTool1: {
                      show: false
                    }
                  }
                }
              })
            }
          },
          myTool2: {
            show: true,
            title: '更新数据',
            icon:
              '<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.666 183.334V0H12V187.5H200V183.334H16.666Z" fill="#707070"/><path d="M43 111H48.6133V161H43V111ZM84.666 86H90.1133V161H84.666V86ZM126.334 98.5H131.613V161H126.334V98.5ZM168 61H174.113V161H168V111V61ZM94.0879 57.9121L135.756 74.5781L181.113 42.8281L177.5 38L135.756 68L94.0879 49.5L52.5 78.5L56.1133 84.4941L94.0879 57.9121Z" fill="#707070"/></svg>',
            onclick: function() {
              that.loadDataList()
            }
          },
          restore: {},
          saveAsImage: {
            pixelRatio: 5,
            saveAsImage: {
              name: '访客地图'
            }
          }
        }
      },
      geo: {
        map: 'world',
        zoom: 1.25,
        roam: true,
        center: [2, 12],
        label: {
          normal: {
            fontSize: '10',
            color: 'rgba(0,0,0,0.7)'
          }
        },
        itemStyle: {
          color: '#ccc',
          normal: {
            borderColor: 'rgba(0, 0, 0, 0.2)'
          },
          emphasis: {
            areaColor: '#ff7875',
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 10,
            borderWidth: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      },
      series: [
        {
          name: '访问量',
          type: 'map',
          geoIndex: 0,
          data: this.dataList
        }
      ]
    })
    window.onresize = function() {
      charts.resize()
    }
    this.charts.on('click', ev => {
      if (ev.name === 'China') {
        charts.setOption({
          geo: {
            map: 'china',
            center: [106, 38]
          },
          toolbox: {
            feature: {
              myTool1: {
                show: true
              }
            }
          }
        })
      }
    })
  }
}
</script>
