import React, { useReducer } from 'react';
import axios from 'axios';
import contactReducer from './contactReducer';
import ContactContext from './contactContext';

import { 
    ADD_CONTACT,
    DELETE_CONTACT,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CONTACT,
    FILTER_CONTACT,
    CLEAR_FILTER,
    CONTACT_ERROR,
    CLEAR_CONTACT,
    GET_CONTACTS
 } from '../types';


 const ContactState = props => {
    const initialState = {
        contacts: null,
        current: null,
        filtered: null,
        error: null,
        loading: true
    }

    const [ state, dispatch ] = useReducer(contactReducer, initialState);

    // get contact
    const getContacts = async () => {
        try {
            const res = await axios.get('/api/contacts');

            dispatch({ type: GET_CONTACTS, payload: res.data });
            
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.msg
            })
        }
    } 

    // Add Contact
    const addContact = async contact => {
        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        }
        try {
            const res = await axios.post('/api/contacts', contact, config);

            dispatch({ type: ADD_CONTACT, payload: res.data });
            
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.msg
            })
        }
    } 

    // Delete Contact
    const deleteContact = id => {
        try {
            axios.delete(`/api/contacts/${id}`);
            dispatch({ type: DELETE_CONTACT, payload: id });    
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.msg
            })
        }
        
    }

    //Clear Contacts
    const clearContacts = () => {
        dispatch({ type: CLEAR_CONTACT});
    }

    // Set Current Contact
    const setCurrent = contact => {
        dispatch({ type: SET_CURRENT, payload: contact });
    }

    // Clear Current Contact
    const clearCurrent = () => {
        dispatch({ type: CLEAR_CURRENT });
    }

    // Update Contact
    const updateContact = async contact => {
        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        }
        try {
            const res = await axios.put(`/api/contacts/${contact._id}`, contact, config);

            dispatch({ type: UPDATE_CONTACT, payload: res.data });
            
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR,
                payload: err.response.msg
            })
        }
    }

    // Filter Contacts
    const filterContact = text => {
        dispatch({ type: FILTER_CONTACT, payload: text });
    }

    // Clear Filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER });
    }

    return (
        <ContactContext.Provider 
        value={{ 
            contacts: state.contacts,
            current: state.current,
            filtered: state.filtered,
            error: state.error,
            loading: state.loading,
            addContact,
            clearCurrent,
            clearContacts,
            setCurrent,
            updateContact,
            filterContact,
            clearFilter,
            deleteContact,
            getContacts 
         }} 
         >
            { props.children }
        </ContactContext.Provider>
    )
 }

 export default ContactState;