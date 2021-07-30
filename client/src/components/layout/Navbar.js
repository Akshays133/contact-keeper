import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import ContactContext from '../../context/contact/contactContext';

const Navbar = ({ title, icon }) => {
    const authcontext = useContext(AuthContext);
    const contactcontext = useContext(ContactContext);

    const { isAuthenticated, logout, user } = authcontext;
    const { clearContacts } = contactcontext;

    const onLogout = () => {
        logout();
        clearContacts();
    }

    const authlinks = (
        <Fragment>
            <li>
                Hello { user && user.name }
            </li>
            <li>
                <a href="#!" onClick={onLogout} >
                    <i className="fas fa-sign-out-alt"></i> <span className="hide-sm">Logout</span>
                </a>
            </li>
        </Fragment>
    );

    const guestlinks = (
        <Fragment>
            <li>
                <Link to='/register'>Register</Link>
            </li>
            <li>
                <Link to='/login'>Login</Link>
            </li>
        </Fragment>
    );

    return (
        <div className='navbar bg-primary'>
            <h2>
                <i className={icon} /> {title}
            </h2>
            <ul>
                {isAuthenticated ? authlinks : guestlinks}
            </ul> 
        </div>
    )
}

Navbar.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string
}

Navbar.defaultProps = {
    title: 'Contact Keeper',
    icon: 'fas fa-id-card-alt'
}

export default Navbar
