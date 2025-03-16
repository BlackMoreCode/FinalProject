import {useContext, useEffect} from "react";
import UploaderComponent from "./UploaderComponent";
import { AdminContext } from "../../context/AdminStore";
import React from "react";


const AdminMain = () => {
	const typeList = ["univ.csv", "textboard.csv", "bank.csv"]
	const context = useContext(AdminContext);
	const setPage = context?.setPage;
	useEffect(() => {
		if (setPage) {
			setPage("main");
		}
	}, []);
	
	return (
		<>
		</>
	);
};

export default AdminMain;
