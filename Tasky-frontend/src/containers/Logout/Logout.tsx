import React, { useEffect } from 'react';
import {Navigate} from 'react-router-dom';
import {connect} from 'react-redux';
import { Dispatch } from 'redux';
import {logout} from '../../store/actions';
import {logoutProps} from '../types.module'

const Logout: React.FC<logoutProps> = props => {
    useEffect(()=>{
        props.onLogout();
    });
    return <Navigate to="/" />
}
const mapDispatchToProps = (dispatch: Dispatch) => {
    return{
        onLogout: () => dispatch(logout())
    }
} 

export default connect(null, mapDispatchToProps)(Logout);