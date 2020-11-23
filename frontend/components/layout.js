import React from 'react'
import Head from 'next/head'
import ActiveLink from './ActiveLink'


const Layout = ({ children, title }) => (
    <html lang="en">
        <Head>
            <title>{ title }</title>
            <link rel="icon" href="/favicon.ico" />
            <link rel="stylesheet" type="text/css" href="/css/timepicker.css" />
            <link rel="stylesheet" type="text/css" href="/css/custom.css" />
            <script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"
                async defer>
            </script>
        </Head>
        <body>
        <img src="/react.png" alt="Vercel Logo" className='logo' />
        {(() => {
        if ( title == 'Contact Us' || title == 'Analytics') {
            return (
                <div className="float-right margin">
                        <ActiveLink activeClassName='active'  href="/contact-us">
                        <button className="button4">Contact Us</button>
                        </ActiveLink>
                        <ActiveLink activeClassName='active'  href="/analytics">
                        <button className="button4">Analytics</button>
                        </ActiveLink>
                </div>
                
                )
        }
        
        })()}
        
        
            {children}
        </body>
    </html>
  );

export default Layout
