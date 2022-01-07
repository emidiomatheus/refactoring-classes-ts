import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodType {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string
}

function Dashboard() {
  const [foods, setFoods] = useState<FoodType[]>([])
  const [editingFood, setEditingFood] = useState({} as FoodType)
  const [isModalAddFoodOpen, setIsModalAddFoodOpen] = useState(false)
  const [isModalEditFoodOpen, setIsModalEditFoodOpen] = useState(false)

  useEffect(() => {
    api.get('/foods')
    .then(response => setFoods(response.data))
  }, [])

  async function handleAddFood(food: FoodType) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data] );
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodType) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setIsModalAddFoodOpen(!isModalAddFoodOpen);
  }

  const toggleEditModal = () => {
    setIsModalEditFoodOpen(!isModalEditFoodOpen);
  }

  function handleEditFood(food: FoodType){
    setEditingFood(food);
    setIsModalEditFoodOpen(true)
  }
  
  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={isModalAddFoodOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isModalEditFoodOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
