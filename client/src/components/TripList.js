import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom'
import {motion} from 'framer-motion'


export default function TripList(props) {

	const [trips, setTrips] = useState([])
	console.log(trips)

	const storedToken = localStorage.getItem('authToken')

	const animateFrom = {opacity: 0, x: -40}
	const animateTo = {opacity: 1, x: 0}

	// get all the trips from the backend / server owned oe joined by user
	const getTrips = () => {
		// request 'api/projects'
		// for every request to a project route we need to also send the token
		axios.get('/api/trips', { headers: { Authorization: `Bearer ${storedToken}` } })
			.then(response => {
				//console.log(response.data)
				// set the state of trips
				setTrips(response.data)
			})
			.catch(err => {
				console.log(err)
			})
	}

	useEffect(() => {
		getTrips()
	}, [])

	return (
		<>
			<ul>
			{trips.map((trip, index) => 
            <motion.li 
				initial={animateFrom}
				animate={animateTo}
				transition={{delay: 0.05 * index}}
				onClick={() => { 
				props.closeSumMenu()
				props.closeNavbar() }} >
			<Link to={`/${trip._id}`}>{trip.title}</Link>
			</motion.li>
            )}
			</ul>			
		</>
	)
}
