import { FlatList, Text, View, TextInput } from "react-native";
import {styled} from "@gluestack-style/react"
import {Spinner} from "@gluestack-ui/themed"
import useGetBalance from "@/hooks/useGetBalance";
import { entityMaster } from "@/utils/constant";
import CardBalance from "../CardBalance";
import { useEffect, useState } from "react";

const WalletMasterBalance = () => {
	const { balance, loading, error } = useGetBalance(entityMaster);
	const [searchText, setSearchText] = useState("");
	const [filteredBalance, setFilteredBalance] = useState([]);

	useEffect(() => {
		  if (searchText) {
			setFilteredBalance(
			  balance.filter((item: any) =>
				item.paymentMethodAlias
				  .toLowerCase()
				  .includes(searchText.toLowerCase())
			  )
			);
		  } else {
			setFilteredBalance(balance);
		  }
		
	  }, [searchText, balance]);
	  
	return(
		<Container>
			{loading && <Spinner size={"small"} />}
			{error && <Text>Error: {error.message}</Text>}
			<TextInput
				placeholder="Buscar por alias de método de pago"
				value={searchText}
				onChangeText={setSearchText}
				style={{
				padding: 10,
				borderWidth: 1,
				borderColor: "#ccc",
				marginBottom: 10,
				borderRadius: 8,
				}}
			/>
			<FlatList
				showsVerticalScrollIndicator={false}
				data={filteredBalance}
				renderItem={({ item }) => (
					<CardBalance {...item} />
				)}
				keyExtractor={(item) => item.paymentMethodReference}
			/>
		</Container>
	)
}

const Container = styled(View, {
	display: "flex",
	flex: 1,
	width: "$full",
	flexDirection: "column",
	m: "$5",
	p: "$5",
	bg: "$backgroundLight150",
	rounded: "$xl",
	borderWidth: "$1",
	borderColor: "$borderLight300",
})

export default WalletMasterBalance