import React, {useEffect} from 'react';
import LandingPage from '../LandingPage/LandingPage';
import Dashboard from '../Dashboard/Dashboard';
import { Route, Routes } from 'react-router-dom';
import Login from '../Login/Login';
import Logout from '../Logout/Logout';
import Register from '../Register/Register';
import CustomNavbar from '../../components/CustomNavbar/CustomNavbar';
import CustomFooter from '../../components/CustomFooter/CustomFooter';
import {connectAuthState, taskyProps} from '../types.module';
import {connect} from 'react-redux';
import {checkAuth} from '../../store/actions';
import NotFound from '../NotFound/NotFound';
import Redux from 'redux';


const Tasky: React.FC<taskyProps> = React.memo(props => {
    useEffect(()=>{
        props.onCheckAuth();
    });
    
    let routes = (
        <React.Fragment>
            <Routes>
                <Route path="/login/*" element={<Login />} />
                <Route path="/register/*" element={<Register />} />
                <Route path="/logout/*" element={<Logout />} />
                <Route path="/tasks/*" element={<Dashboard />} />
                <Route path="/*" element={<LandingPage />} />
                <Route path="/*" element={<NotFound isAuth={props.isAuth} />} />
            </Routes>
        </React.Fragment>
    );
    if(props.isAuth){
        routes = (
            <React.Fragment>
                <Routes>
                    <Route path="/login/*" element={<Login />} />
                    <Route path="/register/*" element={<Register />} />
                    <Route path="/logout/*" element={<Logout />} />
                    <Route path="/tasks/*" element={<Dashboard />} />
                    <Route path="/tasks/create/*" element={<Dashboard />} />
                    <Route path="/tasks/assigned/*" element={<Dashboard />} />
                    <Route path="/*" element={<Dashboard />} />
                    <Route path="/*" element={<NotFound isAuth={props.isAuth}/>} />
                </Routes>
            </React.Fragment>
        );
    }
    return (
    <React.Fragment>
        <CustomNavbar isAuth={props.isAuth} first_name={props.firstName} last_name={props.lastName} />
        {routes}
        <CustomFooter />
    </React.Fragment>
    );
})

const mapStateToProps = (state: connectAuthState) => {
    return {
        isAuth: state.auth.token !== null,
        firstName: state.auth.firstName,
        lastName: state.auth.lastName
    }
}
const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
    return{
        onCheckAuth: () => dispatch(checkAuth())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tasky);