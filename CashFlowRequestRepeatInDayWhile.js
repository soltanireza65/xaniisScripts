async function get({ startDate, count, daysInBetween, interval }) {
    let timeSeries = [];

    for (let index = 0; index < count; index++) {
        let start = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + (daysInBetween * index) + 1)).toISOString().slice(0, 10)
        let end = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + (daysInBetween * (index + 1)))).toISOString().slice(0, 10)
        timeSeries.push({ start, end, });
    }

    for (let index = 0; index < timeSeries.length; index++) {
        const { start, end } = timeSeries[index];
        const response = await fetch("https://tbs.armanbroker.ir/CashFlow/CashFlowRequest/TseAjaxRead?_dc=1689500401727&action=read", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,fa;q=0.8",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://tbs.armanbroker.ir/CashFlow/CashFlowRequest/TseCashFlowRequest?FY=14&_dc=1689500390534",
            "referrerPolicy": "strict-origin-when-cross-origin",
            // "body": `PerformDateFilter=${start}&EndPerformDateFilter==${end}&CashFlowState=Unknown&BankType=Unknown&PartyId=0&Payable=true&WithCheckCredit=true&ShowCustomerConvenience=true&StartCustomerConvenienceDate=${start}&EndCustomerConvenienceDate=${end}&SupplyMoneyCostPercent=25&CashFlowType=StockPayment&AutoLoad=true&ImePaymentTypeEnum=Unknown&name=CashFlowType&value=StockPayment&mode=Auto&encode=false&configOptions=%5Bobject%20Object%5D&configOptions=%5Bobject%20Object%5D&configOptions=%5Bobject%20Object%5D&instanceOf=&autoDataBind=false&resourceManager=&owner=&isDefault=false&isTrackingViewState=true&bindingContainer=&configOptionsExtraction=List&page=1&start=0&limit=2147483647&sort=%5B%7B%22property%22%3A%22RequestDate%22%2C%22direction%22%3A%22DESC%22%7D%5D&FY=14`,
            "body": `PerformDateFilter=${start}&EndPerformDateFilter=${end}&CashFlowState=Unknown&BankType=Unknown&PartyId=0&ShowCustomerConvenience=false&CashFlowType=StockPayment&AutoLoad=true&ImePaymentTypeEnum=Unknown&name=CashFlowType&value=StockPayment&mode=Auto&encode=false&configOptions=%5Bobject%20Object%5D&configOptions=%5Bobject%20Object%5D&configOptions=%5Bobject%20Object%5D&instanceOf=&autoDataBind=false&resourceManager=&owner=&isDefault=false&isTrackingViewState=true&bindingContainer=&configOptionsExtraction=List&page=1&start=0&limit=2147483647&sort=%5B%7B%22property%22%3A%22NationalIdentification%22%2C%22direction%22%3A%22ASC%22%7D%5D&FY=14`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then((response) => response.json())

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${start}-${end}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        await new Promise((res) => setTimeout(res, interval));
    }
}

async function repeatRequestInDay({ loopInterval }, { startDate, count, daysInBetween, reqInterval }) {
    const end = new Date().setHours(23, 59, 59, 999);

    while (end <= Date.now()) {
        get({ startDate, count, daysInBetween, reqInterval });
        await new Promise((res) => setTimeout(res, loopInterval));
    }
}

repeatRequestInDay({ loopInterval: 60000 }, { startDate: "06/5/2023", count: 3, daysInBetween: 14, reqInterval: 10000 })