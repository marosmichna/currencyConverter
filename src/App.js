import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Currency from './components/Currency';

const TableRow = ({ valueTo, valueFrom, serialNumber }) => {
  const [originalValueFrom, setOriginalValueFrom] = useState(valueFrom || '');

  return (
    <tr>
      <td>{serialNumber}</td>
      <td>{originalValueFrom}</td>
      <td>{valueTo}</td>
    </tr>
  );
};

TableRow.propTypes = {
  valueTo: PropTypes.number.isRequired,
  valueFrom: PropTypes.number.isRequired,
  serialNumber: PropTypes.number.isRequired,
};

const App = () => {
  const [amountFrom, setAmountFrom] = useState(1);
  const [amountTo, setAmountTo] = useState(0);
  const [currencyFrom, setCurrencyFrom] = useState('USD');
  const [currencyTo, setCurrencyTo] = useState('EUR');
  const [rates, setRates] = useState([]);
  const [mySumTo, setMySumTo] = useState([]);
  const [mySumFrom, setMySumFrom] = useState([]);
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    axios
      .get(
        'http://data.fixer.io/api/latest?access_key=d7a1bad934afdeec77c45a79be2a1b2f&symbols=USD,CZK,EUR'
      )
      .then((response) => {
        setRates(response.data.rates);
        console.log(response.data);
      });
  }, []);

  console.log(rates)

  useEffect(() => {
    if (rates) {
      handleAmountFromChange(1);
    }
  }, [rates]);

  const formatNumber = (number) => {
    return number.toFixed(4);
  };

  const handleAmountFromChange = (amountFrom) => {
    setAmountTo(
      formatNumber((amountFrom * rates[currencyTo]) / rates[currencyFrom])
    );
    setAmountFrom(amountFrom);
  };

  const handleCurrencyFromChange = (currencyFrom) => {
    setAmountTo(
      formatNumber((amountFrom * rates[currencyTo]) / rates[currencyFrom])
    );
    setCurrencyFrom(currencyFrom);
  };

  const handleAmountToChange = (amountTo) => {
    setAmountFrom(
      formatNumber((amountTo * rates[currencyFrom]) / rates[currencyTo])
    );
    setAmountTo(amountTo);
  };

  const handleCurrencyToChange = (currencyTo) => {
    setAmountFrom(
      formatNumber((amountTo * rates[currencyFrom]) / rates[currencyTo])
    );
    setCurrencyTo(currencyTo);
  };

  const handleSaveButton = () => {
    setMySumTo((prevMySomTo) => [...prevMySomTo, amountTo]);
    setMySumFrom((prevMySomFrom) => [...prevMySomFrom, amountFrom]);
  };

  useEffect(() => {
    setTotalSum(mySumTo.reduce((total, num) => total + Number(num), 0));
  }, [mySumTo]);

  useEffect(() => {
    setTotalSum(0);
    setMySumTo([]);
    setMySumFrom([]);
  }, [currencyTo]);

  console.log(mySumTo);
  console.log(mySumFrom);
  return (
    <div>
      <h1>Currency Converter</h1>
      <Currency
        currencies={Object.keys(rates)}
        amount={amountFrom}
        currency={currencyFrom}
        onAmountChange={handleAmountFromChange}
        onCurrencyChange={handleCurrencyFromChange}
      />
      <Currency
        currencies={Object.keys(rates)}
        amount={amountTo}
        currency={currencyTo}
        onAmountChange={handleAmountToChange}
        onCurrencyChange={handleCurrencyToChange}
      />
      <button onClick={handleSaveButton}>Save</button>
      {totalSum !== 0 && (
        <div className="table-group">
          <table>
            <thead>
              <tr>
                <th>Serial number</th>
                <th>Your money</th>
                <th>Your changed money </th>
              </tr>
            </thead>
            <tbody>
              {mySumTo.map((sumTo, index) => (
                <TableRow
                  className="tableRow"
                  key={index}
                  serialNumber={index + 1}
                  valueFrom={mySumFrom[index] + ' ' + currencyFrom}
                  valueTo={sumTo + ' ' + currencyTo}
                />
              ))}
            </tbody>
          </table>
          <div className="totalSum">
            The amount of your changed money:{' '}
            {totalSum.toFixed(2) + ' ' + currencyTo}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

