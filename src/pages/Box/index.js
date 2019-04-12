import React, { Component } from 'react';
import './styles.css';
import { MdInsertDriveFile } from 'react-icons/md';
import logo from "../../assets/logo.svg";
import api from '../../services/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';
import { Link } from "react-router-dom";

export default class Box extends Component {
  state = {box: {} };

  async componentDidMount(){

    this.subscribeToNewFiles();

    const box = this.props.match.params.id;
    const response =await api.get(`boxes/${box}`);

    this.setState({ box: response.data });
  }

  //atualizando o boxe em real time para todos os usuários verem a atualização dos arquivos
  subscribeToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket('http://localhost:3333');
    io.emit('connectRoom',box);
    io.on("file",data=>{
      this.setState({ box: {...this.state.box, files: [data,... this.state.box.files] }})
    });
  };

  //Passando os arquivos para o boxe ao arrastar ou adicionar
  handleUpload = files =>{
    files.forEach(file => {
      const data = new FormData();
      const box = this.props.match.params.id;
      data.append('file',file);
      api.post(`boxes/${box}/files`,data);
    });
  };

  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt=""/>
        </header>

        <div id="h1Box">
          <h1>{this.state.box.title}</h1>
          <Link to="/">Home</Link>
        </div>

          <Dropzone onDropAccepted={this.handleUpload}>
            { ({ getRootProps,getInputProps }) => (
              <div className="upload" {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Arraste arquivos aqui</p>
              </div>
            )}
          </Dropzone>

        <ul>
          {this.state.box.files && this.state.box.files.map( file=>(
            <li key={file._id}>
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
