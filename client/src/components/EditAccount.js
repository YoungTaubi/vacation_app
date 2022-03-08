import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';



export default function EditAccount(props) {	

	return (
		<>
			<h1>Edit Account</h1>
            <form onSubmit={props.handleSubmit}>
				<label htmlFor="name">Name: </label>
				<input
					id="name"
					type="text"
					value={props.name}
                    placeholder={props.name}
					onChange={props.handleNameChange}
				/>
				<label htmlFor="email">Description: </label>
				<input
					id="email"
					type="text"
					value={props.email}
                    placeholder={props.email}
					onChange={props.handleEmailChange}
				/>
				<button type="submit">Save changes</button>
			</form>				
		</>
	)
}