import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';
import '../MultiselectDropdown.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth'
import { SocketContext } from '../context/socket';


export default function AddTrip(props) {

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [participants, setParticipants] = useState([])
	const [allUsers, setAllUsers] = useState([])

	const storedToken = localStorage.getItem('authToken')

	const navigate = useNavigate()

	const { user } = useContext(AuthContext)
	const { sendNotification } = useContext(SocketContext)

	const userId = user._id

	const getAllUsers = () => {
		axios.get('/api/trips/users', { headers: { Authorization: `Bearer ${storedToken}` } })
			.then(res => {
				setAllUsers(res.data)
			})
			.catch(err => {
				console.log(err)
			})
	}

	const handleSubmit = e => {
		e.preventDefault()
		axios.post('/api/trips', { title, description, participants }, { headers: { Authorization: `Bearer ${storedToken}` } })
			.then(res => {
				setTitle('')
				setDescription('')
				setParticipants([])
				navigate(`/${res.data._id}`)
			})
			.catch(err => console.log(err))
		participants.forEach(participant => {
			sendNotification(participant._id, participant.name, 1)
		})
		setTitle('')
		setDescription('')
		setParticipants([])
	}


	function onSelect(selectedList, selectedItem) {
		if (selectedItem._id.toString() === userId.toString()) {
			setParticipants((state) => [...state, { ...selectedItem, joining: true }]);
		} else {
			setParticipants((state) => [...state, { ...selectedItem, joining: false }]);
		}

	}

	function onRemove(selectedList, removedItem) {
		let participantsCopy = participants.filter(participant => participant._id !== removedItem._id)
		setParticipants(participantsCopy);
	}

	useEffect(() => {
		getAllUsers()
	}, [])

	const filteredUsers = allUsers.filter(user => user._id !== userId)

	return (
		<>
			<div class="container">
				<h2 class='headline'>Add a new Trip</h2>
				<form class='addTripContaier' onSubmit={handleSubmit}>
					<label htmlFor="title">Title: </label>
					<input
						class='addTripInput'
						id="title"
						type="text"
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
					<label htmlFor="title">Description: </label>
					<input
						class='addTripInput'
						id="description"
						type="text"
						value={description}
						onChange={e => setDescription(e.target.value)}
					/>
					<label htmlFor="participants">Participants: </label>

					<Multiselect
						style={{
							chips: {
								background: '#CCFFBD',
								color: '#40394A',
								fontSize: '1em',
								borderRadius: '2em',
								margin: '5px'
							},
							multiselectContainer: {
								color: '#40394A',
							},
							searchBox: {
								width: '240px',
								minHeight: '40px',
								maxHeight: 'fit-content',
								border: '1px solid rgb(200,200,200)',
								borderRadius: '20px',
							},
							optionContainer: {
								background: '#CCFFBD',
								border: 'none',
								borderRadius: '20px',
							},
							option: {
								border: 'none',
							}

						}}
						options={filteredUsers} // Options to display in the dropdown
						// Preselected value to persist in dropdown
						onSelect={onSelect} // Function will trigger on select event
						onRemove={onRemove} // Function will trigger on remove event
						displayValue="name" // Property name to display in the dropdown options
						id="css_custom"
						avoidHighlightFirstOption
						placeholder='Search Participants'
					/>
					<button class='submitButton' type="submit">Add this Trip</button>
				</form>
			</div>


		</>
	)
}
