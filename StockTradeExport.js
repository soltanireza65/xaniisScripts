async function get(s, e, TradeSide, interval) {
  for (var a = [], d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) {
    a.push(new Date(d))
  }
  for (var i = 0; i < a.length; i++) {
    let x= a[i]
    // console.log(a[i])
    const urlencoded = new URLSearchParams()
    urlencoded.append('TradeSide', TradeSide)
    urlencoded.append('DateFilter.EndDate', x.toISOString().slice(0, 10))
    urlencoded.append('BranchId', '-1')
    urlencoded.append('TradeState', 'All')
    urlencoded.append('filterheader', '{}')
    urlencoded.append('page', '1')
    urlencoded.append('start', '0')
    urlencoded.append('limit', '50')
    urlencoded.append('FY', '8')

    fetch('/ClearingSettlement/ClearingSettlement/StockTradeExport', {
      method: 'POST',
      body: urlencoded,
      redirect: 'follow',
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${x.toISOString().slice(0, 10)}-${Math.random().toString(22).substring(2,24)}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    await new Promise((res) => setTimeout(res, interval))
  }
}

get('06/26/2023', '07/01/2023', 'Buy',  30000)
get('06/26/2023', '07/01/2023', 'Sell', 30000)


// mm/dd/yyyy