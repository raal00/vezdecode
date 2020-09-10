import React, { useMemo, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import accounting from 'accounting';

import Checkbox from './Checkbox';

import edit from '../img/edit.svg';
import './place.css';


const Basket = ({ match: { params: { areaId, itemId }}, foodAreas, order }) => {

  var isOrderEmpty = false;
  var disabledBtn = 'activeBtn';
  var rofl = 'Place__order';
  const [ faster, setFaster ] = useState(true);
  const [ time, setTime ] = useState('');
  const [ selfService, setSelfService ] = useState(false);
  const area = foodAreas.filter(area => area.id === areaId)[0];
  const item = area.items.filter(item => item.id === itemId)[0];

  const [ price, products ] = useMemo(() => {
    const foodIds = new Set((item.foods || []).map(item => item.id));

    const products = Object.values(order)
      .filter((value) => {
        const { item: { id }} = value;

        return foodIds.has(id);
      });

    const result = products.reduce((result, value) => {
        const { count, item } = value;
        return result + parseInt(item.price) * parseInt(count);
      }, 0);
      if (result <= 0) isOrderEmpty = true;
    return [ accounting.formatNumber(result, 0, ' '), products ];
  }, [ order, item ]);

  if (isOrderEmpty) return <div className="EmptyOrder">Заказ пуст</div>
  else return (
    <div className="Place">
      <header className="Place__header">
        <aside className="Place__trz">
          <h1 className="Place__head">
            <Link to="/" className="Place__logo">
              {area.name}
            </Link>
          </h1>
          <Link to="/edit" className="Place__change-tz">
            <img
              alt="change-profile"
              src={edit}
            />
          </Link>
        </aside>
      </header>
      <aside className="Place__restoraunt">
        <img
          className="Place__restoraunt-logo"
          alt="Fastfood logo"
          src={item.image}
        />
        <h2
          className="Place__restoraunt-name"
        >
          {item.name}
        </h2>
        <p className="Place__restoraunt-type">
          {item.description}
        </p>
      </aside>
      <div className="Place__products-wrapper">
        <ul className="Place__products">
          {products.map(({ item, count }) => (
            <li
              className="Place__product"
              key={item.id}
            >
              <img
                className="Place__product-logo"
                alt="Ordered product logo"
                src={item.image}
              />
              <h3
                className="Place__product-name"
              >
                {item.name}
              </h3>
              <p
                className="Place__product-price"
              >
                Цена: {item.price}
              </p>
              <p
                className="Place__product-count"
              >
                x{count}
              </p>
            </li>
          ))}
        </ul>
        <Link
          className="Place__change-product"
          to={`/place/${areaId}/${itemId}`}
        >
          Изменить
        </Link>
      </div>
      <div className="Place__choice">
        <h3>Время:</h3>
        <div className="Place__choice-item">
          <span>Как можно быстрее</span>
          <Checkbox
            checked={faster}
            onToggle={() => {
              if (faster) {
                var payelem = document.getElementById('Payment');
                disabledBtn = 'disableBtn';
                payelem.className= rofl +' ' + disabledBtn;
                setFaster(false);
              } else {
                setTime('');
                var payelem = document.getElementById('Payment');
                disabledBtn = 'activeBtn';
                payelem.className= rofl +' ' + disabledBtn;
                setFaster(true);
              }
            }}
          />
        </div>
        <div className="Place__choice-item">
          <span>Назначить</span>
          <input

            value={time}
            onFocus={() => {
              setTime('');
              disabledBtn = 'disableBtn';
              var payelem = document.getElementById('Payment');
              payelem.className= rofl +' ' + disabledBtn;
              setFaster(false);
            }}
            onChange={event => {
              var data = event.target.value;
              
              disabledBtn = 'disableBtn';
              var payelem = document.getElementById('Payment');
              payelem.className= rofl +' ' + disabledBtn;

              if (data.length > 5) data = data.substring(0, 5);

              for (var i = 0; i < data.length; i++)
              {
                if (i===2){
                  if (data[2] !== ':')
                  {
                    if (data.length===3) data = data.substring(0,2) + ':';
                    else data = data.substring(0, i) + '0' + data.substring(i+1, data.length);
                  }
                }
                else
                {
                  var parsed = parseInt(data[i], 10);
                  if (isNaN(parsed))
                    data = data.substring(0, i) + '0' + data.substring(i+1, data.length);
                    //data[i] = '0';
                }
              }
              var hour = 0;
              var min = 0;

              if (data.length >= 2){
                hour = parseInt(data.substring(0,2), 10);
                if (hour >= 24)
                {
                  hour = '24';
                }
                var minpart = data.substring(2, data.length);
                if (data.length > 2) data = hour + minpart;
                else data = hour + ':';

                if (data.length >= 5){
                  min = parseInt(data.substring(3,5),10);
                  if (min >= 60) data = data.substring(0, 3) + '60';

                  disabledBtn = 'activeBtn';
                  payelem.className= rofl +' ' + disabledBtn;
                }
              }

              setFaster(false);
              setTime(data);
            }}
            onBlur={() => {
              if (time) {
                setFaster(false);
              }
            }}
          />
        </div>
        <div className="Place__choice-item">
          <h3>С собой</h3>
          <Checkbox checked={selfService} onToggle={() => setSelfService(!selfService)} />
        </div>
        <div className="Place__choice-item">
          <h3>На месте</h3>
          <Checkbox checked={!selfService} onToggle={() => setSelfService(!setSelfService)} />
        </div>
      </div>
      <footer className="Place__footer">
        <Link id="Payment" to={`/order/${area.id}/${item.id}`} className={rofl+' '+disabledBtn}>
          Оплатить {price}
        </Link>
      </footer>
    </div>
  );
};

export default withRouter(Basket);
