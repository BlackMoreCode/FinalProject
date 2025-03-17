import {useContext, useEffect} from "react";
import UploaderComponent from "./UploaderComponent";
import { AdminContext } from "../../context/AdminStore";
import React from "react";
import styled from "styled-components";


const AdminMain = () => {
	const typeList : ("cocktail"| "food"| "forum")[] = ["cocktail", "food", "forum"]
	const context = useContext(AdminContext);
	const setPage = context?.setPage;
	useEffect(() => {
		if (setPage) {
			setPage("main");
		}
	}, []);
	
	return (
		<Container>
			{/*시각화 자리*/}
			{typeList.map((type ) => (
				<UploaderComponent type={type} key={type} />
			))}
		</Container>
	);
};

export default AdminMain;


const Container = styled.div`
	display: flex;
	width: 100%;
	flex-direction: column;
`
