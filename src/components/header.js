import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { FaDatabase as BitcoinStatsIcon } from "react-icons/fa"
const Header = ({ siteTitle }) => (
  <header >
    <div >
      <h1>
        <Link
          to="/"
        >
          <BitcoinStatsIcon />
          {siteTitle}
        </Link>
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
