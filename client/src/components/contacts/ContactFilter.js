import React, { useContext, useEffect, useRef } from 'react';
import ContactContext from '../../context/contact/contactContext';


const ContactFilter = () => {
    const contactContext = useContext(ContactContext) ;
    const text = useRef('');

    const { filterContact, clearFilter, filtered } = contactContext;

    useEffect(() => {
        if(filtered === null){
            text.current.value = '';
        }
    })

    const onChange = e => {
        if(text.current.value !== '') {
            filterContact(e.target.value);
        } else {
            clearFilter();
        }
    } 
    return (
        <div>
            <form>
                <input ref={text} type="text" placeholder="Filter Contacts..." onChange={onChange} />    
            </form>        
        </div>
    )
}

export default ContactFilter;
