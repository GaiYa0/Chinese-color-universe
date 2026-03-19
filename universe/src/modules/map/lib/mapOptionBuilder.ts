export function createChinaMapOption(scatterData: unknown[]) {
  return {
    backgroundColor: "transparent",
    geo: {
      map: "china",
      roam: true,
      zoom: 1.2,
      label: {
        show: false,
        color: "rgba(255,255,255,0.9)",
        fontSize: 11,
      },
      itemStyle: {
        areaColor: "rgba(30, 60, 90, 0.6)",
        borderColor: "rgba(100, 150, 200, 0.5)",
        borderWidth: 1,
      },
      emphasis: {
        itemStyle: { areaColor: "rgba(50, 100, 150, 0.5)" },
        label: { show: true, color: "#fff", fontSize: 12 },
      },
    },
    series: [
      {
        type: "scatter",
        coordinateSystem: "geo",
        data: scatterData,
        symbolSize: 18,
        itemStyle: {
          color: "#26A69A",
          shadowBlur: 12,
          shadowColor: "rgba(38, 166, 154, 0.6)",
        },
        label: {
          show: true,
          position: "right",
          color: "#26A69A",
          fontSize: 11,
          formatter: "{b}",
        },
        emphasis: { scale: 1.4, itemStyle: { shadowBlur: 20 } },
      },
    ],
  };
}
