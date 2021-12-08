import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./main.css";
import moment from "moment";
import { Select, InputNumber, Col, Row, Button, List, Form, message } from "antd";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

import Smash from "../assets/UltimateLogoEN.png";
import Github from "../assets/github.png";
import ultimateList from './list';
import axios from 'axios';

const { Option } = Select;


export default function Main() {
  const [time, setTime] = useState();
  const [youSelect, setYouSelect] = useState();
  const [data, setData] = useState([]);
  const [winsLosses, setWinsLosses] = useState({ wins: 0, losses: 0 });

  const [opponentSelect, setOpponentSelect] = useState();
  const API_URL = process.env.REACT_APP_API_URL;

  const getBattles = () => {
    axios.get(`${API_URL}/battles`)
      .then(function (response) {
        setData([
          ...data,
          response.data,
        ])
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const getWinsLosses = () => {
    axios.get(`${API_URL}/counter/1`)
      .then(function (response) {
        setWinsLosses(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const putWinsLosses = (wins, losses) => {
    axios.put(`${API_URL}/counter/1`, {
      wins: wins,
      losses: losses,
    })
      .then(function (response) {
        setWinsLosses(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const postBattle = (
    youName,
    youIcon,
    youStock,
    opponentName,
    opponentIcon,
    opponentStock,) => {
    axios.post(`${API_URL}/battles`, {
      youName: youName,
      youIcon: youIcon,
      youStock: youStock,
      opponentName: opponentName,
      opponentIcon: opponentIcon,
      opponentStock: opponentStock,
    })
      .then(function (response) {
        getBattles();

        axios.get(`${API_URL}/counter/1`)
          .then(function (responseCounter) {
            response.data.youStock > response.data.opponentStock ?
              putWinsLosses(responseCounter.data.wins = responseCounter.data.wins + 1, responseCounter.data.losses) :
              putWinsLosses(responseCounter.data.wins, responseCounter.data.losses = responseCounter.data.losses + 1)
          })
          .catch(function (error) {
            console.log(error);
          })
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const deleteBattle = (id) => {
    axios.delete(`${API_URL}/battles/${id}`)
      .then(function (response) {
        getBattles();
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  useEffect(() => {
    getBattles()
    getWinsLosses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeSelectYou = (value, event) => {
    setYouSelect({
      ...youSelect,
      title: event?.children[1],
      slug: event?.value
    })
  }

  const onChangeSelectOpponent = (value, event) => {
    setOpponentSelect({
      ...opponentSelect,
      title: event?.children[1],
      slug: event?.value
    })
  }

  const onChangeStockYou = (value) => {
    setYouSelect({
      ...youSelect,
      stock: value,
    })
  }

  const onChangeStockOpponent = (value) => {
    setOpponentSelect({
      ...opponentSelect,
      stock: value,
    })
  }

  const onFinish = (values) => {
    if (youSelect?.title === undefined) {
      message.warning("Selecione o seu personagem")
    }
    if (opponentSelect?.title === undefined) {
      message.warning("Selecione o personagem inimigo")
    }
    if (youSelect?.stock === undefined) {
      message.warning("Selecione o seu stock final")
    }
    if (opponentSelect?.stock === undefined) {
      message.warning("Selecione o stock final do inimigo")
    }
    if (opponentSelect?.title !== undefined && youSelect?.title !== undefined && opponentSelect?.stock !== undefined && youSelect?.stock !== undefined) {
      var formData = new FormData();
      formData.append('youName', youSelect?.title);
      formData.append('youIcon', youSelect?.slug);
      formData.append('youStock', youSelect?.stock);
      formData.append('opponentName', opponentSelect?.title);
      formData.append('opponentIcon', opponentSelect?.slug);
      formData.append('opponentStock', opponentSelect?.stock);

      postBattle(
        youSelect?.title,
        youSelect?.slug,
        youSelect?.stock,
        opponentSelect?.title,
        opponentSelect?.slug,
        opponentSelect?.stock,
      );
      setTime(moment().format("DD/MM/YYYY HH:mm:ss"))
    }
  };

  const onDelete = (item) => {
    deleteBattle(item.id);
    axios.get(`${API_URL}/counter/1`)
      .then(function (responseCounter) {
        item.youStock > item.opponentStock ?
          putWinsLosses(responseCounter.data.wins = responseCounter.data.wins - 1, responseCounter.data.losses) :
          putWinsLosses(responseCounter.data.wins, responseCounter.data.losses = responseCounter.data.losses - 1)
      })
      .catch(function (error) {
        console.log(error);
      })
    setTime(moment().format("DD/MM/YYYY HH:mm:ss"))
  }


  return (

    <div className="container-all">

      <img className="smash-icon" src={Smash} alt="Logo Smash" />
      <main className="main-container">

        <Col className="">
          <Row span={24} className="winsLosses">
            <Col>
              <h1 style={{ color: '#3fef14' }}>Wins</h1>
              <h1 className="count">{winsLosses?.wins}</h1>
            </Col>
            <Col>
              <h1 style={{ color: '#ff4040' }}>Losses</h1>
              <h1 className="count-2">{winsLosses?.losses}</h1>
            </Col>

          </Row>
        </Col>


        <Form
          onFinish={onFinish}
        >
          <Col className="">
            <Row span={24} className="char-inputs">
              <div>
                <Select
                  name="you"
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a character"
                  optionFilterProp="children"
                  onChange={(value, event) => onChangeSelectYou(value, event)}
                  allowClear
                  value={youSelect?.slug}
                >
                  {ultimateList.ultimateList.map(el => {
                    return (<Option value={el.slug}><img src={`icons/${el.slug}.png`} className="head-icons" alt="header-icon"/>{el.title}</Option>);
                  })}
                </Select>
                <InputNumber min={0} max={10} onChange={onChangeStockYou} value={youSelect?.stock} />
              </div>
              <h1 style={{ color: 'white', margin: '0 40px' }}>VS</h1>
              <div>
                <Select
                  name="opponent"
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a character"
                  optionFilterProp="children"
                  onChange={(value, event) => onChangeSelectOpponent(value, event)}
                  allowClear
                  value={opponentSelect?.slug}
                >
                  {ultimateList.ultimateList.map(el => {
                    return (<Option value={el.slug}><img src={`icons/${el.slug}.png`} className="head-icons" alt="header-icon"/>{el.title}</Option>);
                  })}
                </Select>
                <InputNumber min={0} max={10} onChange={onChangeStockOpponent} value={opponentSelect?.stock} />
              </div>
              <Button icon={<PlusOutlined />} size="large" htmlType="submit" />
            </Row>
          </Col>
        </Form>

        <Col className="list-container-col">
          <List
            itemLayout="horizontal"
            dataSource={data.at(-1)}
            locale={{ emptyText: <div className="no-data"><img src="jigglypuff.gif" alt="no data"/><h1>Sem batalhas registradas</h1></div> }}
            renderItem={(item, index) => (
              <List.Item>
                <Col span={24}>
                  <Row className="list-row">
                    <Col span={18}>
                      <img src={`icons/${item.youIcon}.png`} className="head-icons" alt="header-icon"/><p style={{ display: 'inline', fontSize: '16px' }}>{item.youName}</p>
                      <h2 style={{ display: 'inline', color: 'white', margin: '20px' }}> VS </h2>
                      <img src={`icons/${item.opponentIcon}.png`} className="head-icons" alt="header-icon"/><p style={{ display: 'inline', fontSize: '16px' }}>{item.opponentName}</p>
                    </Col>
                    <Col span={3} style={{ fontSize: '22px' }}>
                      {item.youStock}/{item.opponentStock}
                    </Col>
                    <Col span={3}>
                      <Button icon={<MinusOutlined />} onClick={() => onDelete(item)} />
                    </Col>
                  </Row>
                </Col>
              </List.Item>
            )}
          />
        </Col>
      </main>
      <footer className="footer-container">
        <p style={{ color: "white" }}>Last Updated: {time}</p>
        <p className="footer-line">Made by Pedro Freitas</p>
        <ul className="footer-link-container">
          <li className="footer-link">
            <a href="https://github.com/p-freitas">
              <img className="footer-icon" src={Github} alt="Logo Github" />
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}