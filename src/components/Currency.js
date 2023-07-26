import PropTypes from 'prop-types';
import './Currency.css';

const Currency = (props) => {
  Currency.propTypes = {
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    currencies: PropTypes.array,
    onAmountChange: PropTypes.func,
    onCurrencyChange: PropTypes.func,
  };

  return (
    <div className="currency-group">
      <input
        type="text"
        value={props.amount}
        onChange={(e) => props.onAmountChange(e.target.value)}
      />
      <select
        value={props.currency}
        onChange={(e) => props.onCurrencyChange(e.target.value)}
      >
        {props.currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Currency;
