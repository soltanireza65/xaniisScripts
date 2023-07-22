async function get(TradeSide, interval) {
    let s = new Date().getTime();
    let e = new Date().setHours(23, 59, 59, 999);
    let diff = e - s;
  
    let totalCount = Math.floor(diff / interval);
  
    let dateString = new Date().toISOString().slice(0, 10);
  
    for (var i = 0; i < totalCount; i++) {
      const urlencoded = new URLSearchParams();
      urlencoded.append("TradeSide", TradeSide);
      urlencoded.append("DateFilter.EndDate", dateString);
      urlencoded.append("BranchId", "-1");
      urlencoded.append("TradeState", "All");
      urlencoded.append("filterheader", "{}");
      urlencoded.append("page", "1");
      urlencoded.append("start", "0");
      urlencoded.append("limit", "50");
      urlencoded.append("FY", "8");
  
      fetch("/ClearingSettlement/ClearingSettlement/StockTradeExport", {
        method: "POST",
        body: urlencoded,
        redirect: "follow",
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${dateString}-${Math.random()
            .toString(22)
            .substring(2, 24)}.xlsx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
  
      await new Promise((res) => setTimeout(res, interval));
    }
  }
  
  get("Buy", 900000);
  get("Sell", 900000);