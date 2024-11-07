import { useEffect, useState } from 'react'
import { axiosInstance, getAccessToken } from '@/utils/networking'
import { Card } from './types';

const API_ISSUING = process.env.EXPO_PUBLIC_API_ISSUING

const cardStatus = [ 'created', 'assigned', 'active', 'reserved', 'cancelled', 'blocked' ] as const

interface ICards {
	cards: Card[]
	totalCount: number
}

export default function useGetCards(entityId: string, status: string) {
	const [cards, setCards] = useState<ICards>({
		cards: [],
		totalCount: 0
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();

	const getCards = async (status: string) => {
		setLoading(true);
		try {
			const token = await getAccessToken();
			const url = `${API_ISSUING}/cards`
			const headers = {
				"X-User-Bearer": `Bearer ${token}`,
			}
			const params :any = {
				paymentMethodReference: entityId
			}

			if(status && cardStatus.includes(status as typeof cardStatus[number])){
				params["status"] = status
			};
			
			const cardsRequest = await axiosInstance({
				method: "GET",
				url,
				headers,
				params: params
			});
			setCards(cardsRequest.data);
		} catch (err: any) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getCards(status);
	}, [status]);

	return {
		cards,
		loading,
		error,
		getCards
	};
}