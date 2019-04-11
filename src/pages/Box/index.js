import React, { Component } from 'react';
import './styles.css';
import { MdInsertDriveFile } from 'react-icons/md';
import logo from "../../assets/logo.svg";
import api from '../../services/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';

export default class Box extends Component {
  state = {box: {} };

  async componentDidMount(){
    const box = this.props.match.params.id;
    const response =await api.get(`boxes/${box}`);

    this.setState({ box: response.data });
  }

  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt=""/>
        </header>
          <h1>{this.state.box.title}</h1>

        <ul>
          {this.state.box.files && this.state.box.files.map( file=>(
            <li>
              <a className="fileInfo" href={file.url} target="_blank">
                <MdInsertDriveFile size={24} color="#A5Cfff"/>
                <strong>{file.title}</strong>
              </a>
              <span>Há {distanceInWords(
                file.createdAt,new Date(),{
                  locale: pt
                })}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
