import { FlatList, Text,  StyleSheet } from "react-native";
import { styled } from "@gluestack-style/react"
import { Box, Spinner } from "@gluestack-ui/themed";
import useGetCards from "./useCards"
import CardItem from "../CardItem";
import { useState } from "react";
import Picker from 'react-native-picker-select';

interface CardListProps {
	entityId: string;
}

const CardsList: React.FC<CardListProps> = ({ entityId }) => {
	const [status, setStatus] = useState<string>("");
	const { cards, error, loading, getCards } = useGetCards(entityId, status);
	const pickerSelectStyles = StyleSheet.create({
		inputIOS: {
		  fontSize: 16,
		  paddingVertical: 12,
		  paddingHorizontal: 10,
		  borderWidth: 1,
		  borderColor: 'gray',
		  borderRadius: 4,
		  color: 'black',
		  paddingRight: 30, // to ensure the text is never behind the icon
		  marginBottom: 8
		},
		inputAndroid: {
		  fontSize: 16,
		  paddingHorizontal: 10,
		  paddingVertical: 8,
		  borderWidth: 0.5,
		  borderColor: 'purple',
		  borderRadius: 8,
		  color: 'black',
		  paddingRight: 30, // to ensure the text is never behind the icon
		  marginBottom: 8
		},
	  });

	  const placeholderStatus = {
		label: 'Seleccione un status',
		value: null,
		color: '#9EA0A4',
	  };

	return <>
	<Picker
		onValueChange={(itemValue) => setStatus(itemValue)}
		items={[
			{ label: 'Created', value: 'created' },
			{ label: 'Assigned', value: 'assigned' },
			{ label: 'Active', value: 'active' },
			{ label: 'Reserved', value: 'reserved' },
			{ label: 'Cancelled', value: 'cancelled' },
		]}
		style={{
			...pickerSelectStyles
		}}
		placeholder={placeholderStatus}
	/>
	<Box
		w={"$full"}
		h={"$full"}
	>
		<FlatList
			data={cards.cards}
			keyExtractor={(item) => item.cardIdentifier}
			renderItem={({ item }) => <CardItem {...item} handleReload={getCards} />}
			ListFooterComponent={<>
				{loading && <Spinner size={"small"} />}
			</>}
			ListHeaderComponent={<>
				<TextWrapper>
					Total de tarjetas: {cards.totalCount}
				</TextWrapper>
			</>}
			ListEmptyComponent={<>
				{error ?
					<ErrorText>Error obteniendo las tarjetas: {error.message}</ErrorText>
					:
					<TextWrapper mt={"$4"} textAlign="center">
						No hay tarjetas disponibles
					</TextWrapper>
				}
			</>}
		/>
	</Box>
	</>
}

const TextWrapper = styled(Text, {
	color: "$black",
	_dark: {
		color: "$white",
	}
})

const ErrorText = styled(TextWrapper, {
	fontSize: "$lg",
	color: "$red200",
	_dark: {
		color: "$red900",
	}
})

export default CardsList
