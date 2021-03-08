import React from "react"
import axios from "axios"

import Layout from "../components/layout"
import SEO from "../components/seo"

import BlockchainHeader from "../images/blockchain.jpg"
import CoinsHeader from "../images/coins.jpg"
import CompetitionHeader from "../images/competition.jpg"
import HalveningHeader from "../images/halvening.jpg"
import MempoolHeader from "../images/mempool.jpg"
import MiningHeader from "../images/mining.jpg"
import NetworkHeader from "../images/network.jpg"
import UTXOsHeader from "../images/utxos.jpg"

const marketNames = {
  CNY: "Chinese Yuan Renminbi",
  USD: "US Dollar",
  EUR: "Euro",
  JPY: "Japanese Yen",
  GBP: "British Pound",
  KRW: "Korean Won",
  INR: "Indian Rupee",
  CAD: "Canadian Dollar",
  AUD: "Austrailian Dollar",
  HKD: "Hong Kong Dollar",
  TWD: "Taiwan Dollar",
  BRL: "Brazilian Real",
  CHF: "Swiss Franc",
  RUB: "Russian Ruble",
  THB: "Thai Baht",
  MXN: "Mexican Peso",
  GOLD: "Gold",
  SILVER: "Silver",
  "2222.SR": "Saudi Aramco",
  AAPL: "Apple",
  MSFT: "Microsoft",
  AMZN: "Amazon",
  GOOG: "Alphabet",
  TCEHY: "Tencent",
  FB: "Facebook",
  BABA: "Alibaba",
  "BRK-A": "Berkshire Hathaway",
  TSLA: "Tesla",
}

const stockMarkets = [
  {
    abbreviation: "SA",
    name: "Saudi Aramco",
    marketCapDollars: 2064000000000,
  },
  {
    abbreviation: "APPL",
    name: "Apple",
    marketCapDollars: 2038000000000,
  },
  {
    abbreviation: "MICR",
    name: "Microsoft",
    marketCapDollars: 1747000000000,
  },
  {
    abbreviation: "AMZN",
    name: "Amazon",
    marketCapDollars: 1511000000000,
  },
  {
    abbreviation: "ALPH",
    name: "Alphabet",
    marketCapDollars: 1416000000000,
  },
  {
    abbreviation: "TEN",
    name: "Tencent",
    marketCapDollars: 856000000000,
  },
  {
    abbreviation: "FB",
    name: "Facebook",
    marketCapDollars: 752000000000,
  },
  {
    abbreviation: "BABA",
    name: "Alibaba",
    marketCapDollars: 645000000000,
  },
  {
    abbreviation: "TSMC",
    name: "Tawain Semiconductor",
    marketCapDollars: 587000000000,
  },
  {
    abbreviation: "BRK-A",
    name: "Berkshire Hathaway",
    marketCapDollars: 581000000000,
  },
  {
    abbreviation: "TSLA",
    name: "Tesla",
    marketCapDollars: 574000000000,
  },
]
const assetMarkets = [
  {
    abbreviation: "GOLD",
    name: "Gold",
    marketCapDollars: 10787000000000,
  },
  {
    abbreviation: "SILVER",
    name: "Silver",
    marketCapDollars: 1382000000000,
  },
]

const IndexPage = () => {
  const [currentData, setCurrentData] = React.useState(null)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    const cachedDataJSON = localStorage.getItem("bitcoin-stats-currentdata")
    const cachedData = JSON.parse(cachedDataJSON)
    const currentTime = new Date().getTime()

    const fetchCurrentData = async () => {
      try {
        const currentResponse = await axios.get(
          "https://node.nodeupdate.com/nodeinfo/currentdata"
        )
        setCurrentData(currentResponse.data[1])

        const cachedData = {
          currentData: currentResponse.data[1],
          time: new Date().getTime(),
        }

        const cachedDataJSON = JSON.stringify(cachedData)
        localStorage.setItem("bitcoin-stats-currentdata", cachedDataJSON)

        setTimeout(() => {
          console.log(`Hello ✌(ツ)`)
        }, 400)
      } catch (e) {
        setError(error)
      }
    }

    if (!cachedData || (cachedData && currentTime - cachedData.time > 60000)) {
      fetchCurrentData()
    } else {
      setCurrentData(cachedData.currentData)
    }
  }, [error])

  const date = new Date()
  const time = date.getTime() / 1000
  const accurateHeight = 672893
  const accurateBitcoins = 18642882.38009877

  const format = num => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }

  let totalBitcoins
  let comparisonData
  let nextRetargetDate
  let nextHalveningDate

  if (!!currentData) {
    totalBitcoins =
      (currentData.bestBlockHeight - accurateHeight) * 6.25 + accurateBitcoins

    const companies = currentData.companyInfo
      .map(company => {
        company.marketCapBitcoin =
          (company.marketCapDollars * 1000000000) / currentData.bitcoinPrice
        return company
      })
      .filter(company => company.abbreviation !== "BTC")
    const currencies = currentData.currencyInfo.filter(
      currency => currency.abbreviation !== "BTC"
    )
    comparisonData = [...companies, ...currencies]

    const nextDifficultyAdjustment =
      date.getTime() +
      (2016 - (currentData.bestBlockHeight % 2016)) * 10 * 60 * 1000
    nextRetargetDate = new Date(nextDifficultyAdjustment).toLocaleDateString()

    const nextHalvening =
      date.getTime() + (840000 - currentData.bestBlockHeight) * 10 * 60 * 1000
    nextHalveningDate = new Date(nextHalvening).toLocaleDateString()
  }

  console.log(currentData)

  return (
    <Layout>
      <SEO title="Home" />
      {currentData && (
        <div>
          <main>
            <div className="container">
              <section>
                <h2>Markets</h2>
                <img className="header-image" src={CoinsHeader} />

                <div className="stats">
                  <div className="stat">
                    <div className="stat-label">Bitcoin Price</div>
                    <div className="stat-value">
                      ${format(currentData.bitcoinPrice.toFixed(2))}
                    </div>
                  </div>

                  {/* <div className="stat">
                    <div className="stat-label">Price Range (24h)</div>
                    <div className="stat-value">*$47,234 - $50,250</div>
                  </div> */}
                  <div className="stat">
                    <div className="stat-label">Volume (24h)</div>
                    <div className="stat-value">
                      $
                      {format(
                        Math.round(
                          currentData.dailyVolume * currentData.bitcoinPrice
                        )
                      )}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Market Cap</div>
                    <div className="stat-value">
                      {" "}
                      $
                      {format(
                        (
                          currentData.bitcoinPrice *
                          ((currentData.bestBlockHeight - accurateHeight) *
                            6.25 +
                            accurateBitcoins)
                        ).toFixed(0)
                      )}
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-label">Total Bitcoins</div>
                    <div className="stat-value">
                      {format(
                        (
                          (currentData.bestBlockHeight - accurateHeight) *
                            6.25 +
                          accurateBitcoins
                        ).toFixed(2)
                      )}{" "}
                      BTC
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-label">% Issued</div>
                    <div className="stat-value">
                      {format(
                        (
                          (((currentData.bestBlockHeight - accurateHeight) *
                            6.25 +
                            accurateBitcoins) /
                            21000000) *
                          100
                        ).toFixed(2)
                      )}
                      %
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Dollar Price</div>
                    <div className="stat-value">
                      {format(Math.round(100000000 / currentData.bitcoinPrice))}
                      &nbsp;sats{" "}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Gold Oz Price</div>
                    <div className="stat-value">
                      {format(
                        Math.round(
                          100000000 *
                            (currentData.goldPrice / currentData.bitcoinPrice)
                        )
                      )}
                      &nbsp;sats{" "}
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <h2>Blockchain</h2>
                <img className="header-image" src={BlockchainHeader} />

                <div className="stats">
                  <Stat
                    label="Block Height"
                    value={format(currentData.bestBlockHeight)}
                  />
                  <div className="stat">
                    <div className="stat-label">Last Block Time</div>
                    <div className="stat-value">
                      {new Date(
                        currentData.lastBlockInfo.time * 1000
                      ).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Blockchain Size</div>
                    <div className="stat-value">
                      {format(currentData.blockchainSize)} GB
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-label">Total Transactions</div>
                    <div className="stat-value">
                      {format(currentData.totalTransactions)}
                    </div>
                  </div>

                  <Stat
                    label="Last Block Tx Count"
                    value={format(currentData.lastBlockInfo.tx)}
                    units="txns"
                  />

                  <div className="stat">
                    <div className="stat-label">Last Block Size / Weight</div>
                    <div className="stat-value">
                      {(currentData.lastBlockInfo.size / 1000000).toFixed(2)} mb
                      /{" "}
                      {(currentData.lastBlockInfo.weight / 1000000).toFixed(2)}{" "}
                      mb
                    </div>
                  </div>
                  <Stat
                    label="Avg Block Interval (24h)"
                    value={((144 / currentData.blocksLastDay) * 10).toFixed(2)}
                    units="min"
                    url={`/charts/block-interval-24h`}
                  />
                  <Stat
                    label="Block Space Added (24h)"
                    value={(currentData.blockSizeLastDay / 1000000).toFixed(2)}
                    units="mb"
                    url={`/charts/block-space-added-24h`}
                  />
                </div>
              </section>
              <section>
                <h2>Mining</h2>
                <img className="header-image" src={MiningHeader} />

                <div className="stats">
                  <Stat
                    label="Hashrate"
                    value={(
                      currentData.networkHashrate / 1000000000000000000
                    ).toFixed(2)}
                    units="EH/s"
                    url={`/charts/hashrate`}
                  />

                  <div className="stat">
                    <div className="stat-label">Blocks Mined (24h)</div>
                    <div className="stat-value">
                      {currentData.blocksLastDay} blocks
                    </div>
                  </div>
                  <Stat
                    label="Block Reward (24h)"
                    value={format(currentData.blocksLastDay * 6.25)}
                    units="BTC"
                    url={`/charts/new-bitcoin-mined-24h`}
                  />

                  <Stat
                    label="Tx Count (24h)"
                    value={format(currentData.transactionsLastDay)}
                    units="txns"
                    url={`/charts/transactions-24h`}
                  />
                  <Stat
                    label="Difficulty"
                    value={(currentData.difficulty / 1000000000000).toFixed(2)}
                    units="trillion"
                    url={`/charts/difficulty`}
                  />
                  <div className="stat">
                    <div className="stat-label">Blocks until retarget</div>
                    <div className="stat-value">
                      {format(2016 - (currentData.bestBlockHeight % 2016))}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Estimate Retarget Date</div>
                    <div className="stat-value">{nextRetargetDate}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Next difficulty estimate</div>
                    <div className="stat-value">
                      {currentData.difficultyRetarget.projectedPercent}%
                    </div>
                  </div>

                  {/* <div className="stat">
                    <div className="stat-label">Block Reward (BTC)</div>
                    <div className="stat-value">6.25 BTC</div>
                  </div> */}
                  {/* <div className="stat">
                    <div className="stat-label">Block Reward (USD)</div>
                    <div className="stat-value">
                      ${format((6.25 * currentData.bitcoinPrice).toFixed(2))}
                    </div>
                  </div> */}
                </div>
              </section>

              <section>
                <h2>Markets Comparison</h2>
                <img className="header-image" src={CompetitionHeader} />
                <div className="comparisons-header">
                  <div>Market</div>
                  <div>% progress</div>
                  <div>Size in BTC</div>
                </div>
                <div className="stats">
                  {[...comparisonData]
                    .filter(market => {
                      if (!market.marketCapBitcoin) {
                        market.marketCapBitcoin = Math.round(
                          market.marketCapDollars / currentData.bitcoinPrice
                        )
                      }
                      if (market.marketCapBitcoin > totalBitcoins) {
                        return true
                      }
                    })
                    .sort((a, b) => a.marketCapBitcoin - b.marketCapBitcoin)
                    .reverse()
                    .filter((_, index, array) => index > array.length - 4)
                    .map(market => {
                      return (
                        <div className="stat" key={market.abbreviation}>
                          <div className="stat-label">
                            {marketNames[market.abbreviation]}
                          </div>
                          <div>
                            {(
                              (totalBitcoins / market.marketCapBitcoin) *
                              100
                            ).toFixed(2)}
                            %
                          </div>
                          <div className="stat-value">
                            {format(Math.round(market.marketCapBitcoin))}
                          </div>
                        </div>
                      )
                    })}
                  <div className="stat">
                    <div className="stat-label">Bitcoin</div>
                    <div className="stat-value">
                      {format(Math.round(totalBitcoins))}
                    </div>
                  </div>
                  {[...comparisonData]
                    .filter(market => {
                      if (!market.marketCapBitcoin) {
                        market.marketCapBitcoin = Math.round(
                          market.marketCapDollars / currentData.bitcoinPrice
                        )
                      }
                      if (market.marketCapBitcoin < totalBitcoins) {
                        return true
                      }
                    })
                    .sort((a, b) => a.marketCapBitcoin - b.marketCapBitcoin)
                    .reverse()
                    .filter((_, index) => index < 3)
                    .map(market => {
                      return (
                        <div className="stat" key={market.abbreviation}>
                          <div className="stat-label">
                            {marketNames[market.abbreviation]}
                          </div>
                          <div>
                            {(
                              (totalBitcoins / market.marketCapBitcoin) *
                              100
                            ).toFixed(2)}
                            %
                          </div>
                          <div className="stat-value">
                            {format(Math.round(market.marketCapBitcoin))}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </section>
              <section>
                <h2>Network</h2>
                <img className="header-image" src={NetworkHeader} />
                <div className="stats">
                  <Stat
                    label="Bitcoin Nodes"
                    value={format(currentData.bitcoinNodes)}
                    units="nodes"
                    url={`/charts/bitcoin-node-count`}
                  />
                </div>
                <h3>Node Versions</h3>
                <div className="stats">
                  {currentData.nodeVersions.map(version => {
                    return (
                      <div className="stat">
                        <div className="stat-label">
                          {version.version.replace("&nbsp;&nbsp;", " ")}
                        </div>
                        <div className="stat-value">{version.percentage}%</div>
                      </div>
                    )
                  })}
                  {/* <div className="stat">
                    <div className="stat-label">Satoshi 0.21.0</div>
                    <div className="stat-value">*23.2%</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Satoshi 0.20.1</div>
                    <div className="stat-value">*21.9%</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Satoshi 0.20.0</div>
                    <div className="stat-value">*13%</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Satoshi 0.18.0</div>
                    <div className="stat-value">*5.4%</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Satoshi 0.18.1</div>
                    <div className="stat-value">*5.4%</div>
                  </div> */}
                </div>
              </section>
              <section>
                <h2>Halvening</h2>
                <img className="header-image" src={HalveningHeader} />

                <div className="stats">
                  <Stat
                    label="Blocks Left"
                    value={format(840000 - currentData.bestBlockHeight)}
                    units="blocks"
                  />
                  <Stat
                    label="Days Left"
                    value={format(
                      ((840000 - currentData.bestBlockHeight) / 144).toFixed(2)
                    )}
                    units="days"
                  />
                  <div className="stat">
                    <div className="stat-label">Next Date (estimated)</div>
                    <div className="stat-value">{nextHalveningDate}</div>
                  </div>
                  <Stat
                    label="Coins Left"
                    value={format(
                      (840000 - currentData.bestBlockHeight) * 6.25
                    )}
                    units="BTC"
                  />

                  <Stat
                    label="Bitcoin Stock to flow"
                    value={(
                      ((currentData.bestBlockHeight - accurateHeight) * 6.25 +
                        accurateBitcoins) /
                      (900 * 365)
                    ).toFixed(2)}
                  />
                  {/* <div className="stat">
                    <div className="stat-label">Gold Stock to flow</div>
                    <div className="stat-value">59</div>
                  </div> */}
                </div>
              </section>
              {/* <section>
                <h2>UTXOs</h2>
                <img className="header-image" src={UTXOsHeader} />
                <div className="stats">
                  <div className="stat">
                    <div className="stat-label">Total Spendable Outputs</div>
                    <div className="stat-value">*70,000,000</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">New Addresses (24h)</div>
                    <div className="stat-value">*+600,000</div>
                  </div>
                </div>
              </section> */}
              <section>
                <h2>Mempool</h2>
                <img className="header-image" src={MempoolHeader} />
                <div className="stats">
                  <Stat
                    label="Mempool Size"
                    value={format(currentData.mempoolSize)}
                    units="txns"
                    url={`/charts/mempool`}
                  />
                  <div className="stat">
                    <div className="stat-label">Pending Fees</div>
                    <div className="stat-value">
                      {currentData.mempoolPendingFees} BTC
                    </div>
                  </div>
                  {/* <div className="stat">
                    <div className="stat-label">Suggested Slow</div>
                    <div className="stat-value">*50 sats/byte</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Suggested Medium</div>
                    <div className="stat-value">*50 sats/byte</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Suggested Fast</div>
                    <div className="stat-value">*50 sats/byte</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Mempool Size</div>
                    <div className="stat-value">*90mb</div>
                  </div> */}
                  <div className="stat">
                    <div className="stat-label">Percent RBF</div>
                    <div className="stat-value">
                      {currentData.mempoolPercentRBF}%
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <h2>Lightning</h2>
                <img className="header-image" src={UTXOsHeader} />
                <div className="stats">
                  <div className="stat">
                    <div className="stat-label">Public Capacity</div>
                    <div className="stat-value">
                      {format(currentData.lightningCapacity)} BTC
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Public Capacity Value</div>
                    <div className="stat-value">
                      $
                      {format(
                        Math.floor(
                          currentData.lightningCapacity *
                            currentData.bitcoinPrice
                        )
                      )}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Public Node Count</div>
                    <div className="stat-value">
                      {format(currentData.lightningNodes)}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Public Channel Count</div>
                    <div className="stat-value">
                      {format(currentData.lightningChannels)}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      )}
    </Layout>
  )
}

const Stat = ({ label, value, units, url }) => {
  return (
    <div className="stat">
      <div className="stat-label">{label} </div>
      <div className="stat-value">
        <div>
          {value}
          {units && <span className="stat-units">&nbsp;{units}</span>}
        </div>
      </div>
    </div>
  )
}

export default IndexPage
