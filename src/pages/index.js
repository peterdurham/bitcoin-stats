import React from "react"
import { Link } from "gatsby"
import axios from "axios"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import BlockchainHeader from "../images/blockchain.jpg"
import CoinsHeader from "../images/coins.jpg"
import CompetitionHeader from "../images/competition.jpg"
import HalveningHeader from "../images/halvening.jpg"
import MempoolHeader from "../images/mempool.jpg"
import MiningHeader from "../images/mining.jpg"
import NetworkHeader from "../images/network.jpg"
import UTXOsHeader from "../images/utxos.jpg"

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
        setCurrentData(currentResponse.data[0])

        const cachedData = {
          currentData: currentResponse.data[0],
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
  const accurateHeight = 636756
  const accurateBitcoins = 18417196

  const format = num => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }

  console.log(currentData)
  return (
    <div>
      <SEO title="Home" />
      {currentData && (
        <div>
          <main>
            <h1 className="title">bitcoin-stats.com</h1>
            <div className="container">
              <section>
                <h2>Markets</h2>
                <img className="header-image" src={CoinsHeader} />

                <div className="stats">
                  <div className="stat">
                    <div className="stat-label">Bitcoin</div>
                    <div className="stat-value">
                      $ {format(currentData.bitcoinPrice.toFixed(2))}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Market Cap</div>
                    <div className="stat-value">
                      {" "}
                      $ {format(
                        (
                          currentData.bitcoinPrice *
                          ((currentData.bestBlockHeight - accurateHeight) *
                            12.5 +
                            accurateBitcoins)
                        ).toFixed(0)
                      )}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Dollar</div>
                    <div className="stat-value">
                      {format(Math.round(100000000 / currentData.bitcoinPrice))}
                       &nbsp;sats{" "}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Gold Oz</div>
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
                <div>
                  <h3>
                    Last Block&nbsp;
                    {/* <span className="subheader">
                      (
                      {Math.floor(
                        ((time - currentData.lastBlockInfo.time) / 60).toFixed(
                          2
                        )
                      )}
                      :
                      {(
                        "0" +
                        Math.floor(
                          ((
                            (time - currentData.lastBlockInfo.time) /
                            60
                          ).toFixed(2) %
                            1) *
                            60
                        )
                      ).slice(-2)}{" "}
                      time since)
                    </span> */}
                  </h3>
                  <div className="stats">
                    <Stat
                      label="Height"
                      value={format(currentData.bestBlockHeight)}
                    />
                    <Stat
                      label="Time"
                      value={new Date(
                        currentData.lastBlockInfo.time * 1000
                      ).toLocaleTimeString()}
                    />

                    <Stat
                      label="Tx Count"
                      value={format(currentData.lastBlockInfo.tx)}
                      units="txns"
                    />
                    <Stat
                      label="Size"
                      value={(currentData.lastBlockInfo.size / 1000000).toFixed(
                        2
                      )}
                      units="mb"
                    />
                    <Stat
                      label="Weight"
                      value={(
                        currentData.lastBlockInfo.weight / 1000000
                      ).toFixed(2)}
                      units="mb"
                    />
                  </div>
                </div>
                <div>
                  <h3>Last 24 Hours</h3>
                  <div className="stats">
                    <Stat
                      label="Blocks Mined"
                      value={currentData.blocksLastDay}
                      units="blocks"
                      url={`/charts/blocks-mined-24h`}
                    />
                    <Stat
                      label="Block Reward"
                      value={format(currentData.blocksLastDay * 6.25)}
                      units="BTC"
                      url={`/charts/new-bitcoin-mined-24h`}
                    />
                   
                    <Stat
                      label="Tx Count"
                      value={format(currentData.transactionsLastDay)}
                      units="txns"
                      url={`/charts/transactions-24h`}
                    />
                     <Stat
                      label="Avg Block Interval"
                      value={((144 / currentData.blocksLastDay) * 10).toFixed(
                        2
                      )}
                      units="min"
                      url={`/charts/block-interval-24h`}
                    />
                    <Stat
                      label="Avg Tx Size"
                      value={(
                        currentData.blockSizeLastDay /
                        currentData.transactionsLastDay
                      ).toFixed(2)}
                      units="bytes"
                      url={`/charts/avg-transaction-size-24h`}
                    />
                    <Stat
                      label="Block Space Added"
                      value={(currentData.blockSizeLastDay / 1000000).toFixed(
                        2
                      )}
                      units="mb"
                      url={`/charts/block-space-added-24h`}
                    />
                  </div>
                </div>
              </section>
              <section>
                <h2>Network</h2>
                <img className="header-image" src={NetworkHeader} />
                <div className="stats">
                  <Stat
                    label="Hashrate"
                    value={(
                      currentData.networkHashrate / 1000000000000000000
                    ).toFixed(4)}
                    units="EH/s"
                    url={`/charts/hashrate`}
                  />
                  <Stat
                    label="Bitcoin Nodes"
                    value={format(currentData.bitcoinNodes)}
                    units="nodes"
                    url={`/charts/bitcoin-node-count`}
                  />
                </div>
              </section>
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
                </div>
              </section>
              <section>
                <h2>Mining</h2>
                <img className="header-image" src={MiningHeader} />

                <div className="stats">
                  <Stat
                    label="Difficulty"
                    value={(currentData.difficulty / 1000000000000).toFixed(4)}
                    units="trillion"
                    url={`/charts/difficulty`}
                  />
                  <Stat
                    label="Total Bitcoins"
                    value={format(
                      (currentData.bestBlockHeight - accurateHeight) * 12.5 +
                        accurateBitcoins
                    )}
                    units="BTC"
                    url={`/charts/total-bitcoins`}
                  />
                  <Stat
                    label="Stock to flow"
                    value={(
                      ((currentData.bestBlockHeight - accurateHeight) * 12.5 +
                        accurateBitcoins) /
                      (900 * 365)
                    ).toFixed(2)}
                  />
                </div>
              </section>
              <section>
                <h2>Halvening</h2>
                <img className="header-image" src={HalveningHeader} />

                <div className="stats">
                  <Stat
                    label="Blocks until Halvening"
                    value={format(840000 - currentData.bestBlockHeight)}
                    units="blocks"
                  />
                  <Stat
                    label="Days until Halvening"
                    value={format(
                      ((840000 - currentData.bestBlockHeight) / 144).toFixed(2)
                    )}
                    units="days"
                  />
                  <Stat
                    label="Coins Left in Era"
                    value={format(
                      (840000 - currentData.bestBlockHeight) * 6.25
                    )}
                    units="BTC"
                  />
                </div>
              </section>
           

              {/* <section>
                <h2>UTXOs</h2>
                <img className="header-image" src={UTXOsHeader} />
              </section>

              <section>
                <h2>Market Comparison</h2>
                <img className="header-image" src={CompetitionHeader} />
              </section> */}
            </div>
          </main>
        </div>
      )}
    </div>
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
