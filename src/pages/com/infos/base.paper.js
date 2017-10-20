// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

import { getData, getCache, getRouter } from '../../../utils/helpers';
import { DATA_TYPE_BASE, RESET_INFO } from '../../../enum';
import Code from '../../../code';
import Lang from '../../../language';

class Base extends Component {
    state = {
        company_name: "", province: "", qualification: ""
    }

    componentDidMount() {
        this.setState({
            company_name: "",
            province: "",
            qualification: ""
        });
         if (getCache(DATA_TYPE_BASE) !== undefined) {
            var data = getCache(DATA_TYPE_BASE);
             this.setState({
                company_name: data.company_name,
                province: data.province,
                 qualification: data.qualification
             });
         }
    }

    submit = () => {


        var cb = (route, message, arg) => {
            console.log(message);
            if (message.code === 100111) {

                console.log(arg.data);

                window.CacheData.base = arg.data;

                console.log(getCache(DATA_TYPE_BASE));
                // arg.self.state.data = 
            }

        }

        var obj = {
            company_name: document.getElementById("company_name").value,
            province: document.getElementById("province").value,
            qualification: document.getElementById("qualification").value,
            reset:1
        }
        console.log(obj);
        getData(getRouter(RESET_INFO), { session: sessionStorage.session, base: obj }, cb, { self: this, data: obj });
    }

    render() {
        return (
            <div>
                <Paper style={{ width: 600 }}>
                    <TextField
                        id="company_name"
                        label={Lang[window.Lang].pages.com.infos.base.company_name}
                        value={this.state.company_name}
                        onChange={event => {
                            this.setState({
                                company_name: event.target.value,
                            });
                        }}
                        fullWidth
                    />
                    <TextField
                        id="province"
                        label={Lang[window.Lang].pages.com.infos.base.province}
                        value={this.state.province}
                        onChange={event => {
                            this.setState({
                                province: event.target.value,
                            });
                        }}
                        fullWidth
                    />
                    <TextField
                        id="qualification"
                        label={Lang[window.Lang].pages.com.infos.base.qualification}
                        value={this.state.qualification}
                        onChange={event => {
                            this.setState({
                                qualification: event.target.value,
                            });
                        }}
                        fullWidth
                    />
                    <Button
                        raised
                        color="accent"
                        onClick={() => {
                            this.submit();
                            
                        }}
                    >
                        {Lang[window.Lang].pages.main.certain_button}
                    </Button>
                </Paper>

            </div>
        );
    }



};

export default Base;
