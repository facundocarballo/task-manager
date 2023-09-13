import { DragHandleIcon, EditIcon, InfoIcon } from '@chakra-ui/icons';
import { Box, Button, HStack, Spacer, Text, VStack, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import {
   AlertDialog,
   AlertDialogBody,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogContent,
   AlertDialogOverlay,
   AlertDialogCloseButton,
} from '@chakra-ui/react'
import React, { ReactElement } from 'react';
import { ITask, Task } from './Task';
import { useProvider } from '../context';
import { handleDragAndDrop } from '../handlers/dragAndDrop';
import { copyCategories } from '../handlers/categories';
import { copyTasks } from '../handlers/task';
import { InputInfo } from './InputInfo';
import { CreateCategory } from './CreateCategory';


export interface ICategory {
   id: number,
   title: string,
   description: string,
   tasks: ITask[],
   tasksCompleted: ITask[],
   tasksDeleted: ITask[],
   color: string,
}

export const Category = ({ title, description, tasks, color, id }: ICategory) => {
   // Attributes
   const taskDraggable = React.useRef<any>(null);
   const taskReplaced = React.useRef<any>(null);
   const [showDragIcon, setShowDragIcon] = React.useState<boolean>(false);
   const bgIconsButton = useColorModeValue('light.bg', 'dark.bg');
   // Create Task
   const [createTaskIsOpen, setCreateTaskIsOpen] = React.useState<boolean>(false);
   const [taskTitle, setTaskTitle] = React.useState<string>('');
   const [taskDescription, setTaskDescription] = React.useState<string>('');
   const [taskEndDate, setTaskEndDate] = React.useState<Date>(new Date());
   // Edit Category
   const [newTitle, setNewTitle] = React.useState<string>('');
   const [newDescription, setNewDescription] = React.useState<string>('')
   const [newColor, setNewColor] = React.useState<string>('')
   // Alert Dialog
   const [openEdit, setOpenEdit] = React.useState<boolean>(false);
   const { isOpen, onOpen, onClose } = useDisclosure();
   const cancelRef = React.useRef(null);
   // Context
   const { categories, setCategories } = useProvider();
   // Methods

   const handleDragOnEnd = () => {
      if (categories == null) return;
      let cats: ICategory[] = copyCategories(categories);
      let tasks = handleDragAndDrop(
         taskDraggable.current,
         taskReplaced.current,
         cats[id].tasks
      );
      cats[id].tasks = tasks;
      setCategories(cats);
   };

   const handleShowDragIcon = (): ReactElement<any> | null => {
      if (showDragIcon) {
         return (
            <>
               <Box w='5px' />
               <DragHandleIcon
                  cursor='pointer'
                  _hover={{
                     shadow: 'lg',
                     transform: 'scale(1.1)',
                  }}
               />
            </>
         );
      }
      return <>
         <Box w='30px' />
      </>;
   }

   const handleMouseEnter = () => {
      setShowDragIcon(true)
   }

   const handleMouseLeave = () => {
      setShowDragIcon(false)
   }

   const handleSetDate = (e: string) => {
      const date = new Date(e);
      setTaskEndDate(date);
   };

   const handleCreateTask = () => {
      if (categories == null) return;
      let cats = copyCategories(categories);
      const taskId = Math.random() * 100000;
      let tasks = copyTasks(cats[id].tasks);

      tasks.push({
         title: taskTitle,
         category_id: id,
         id: taskId,
         dateCreated: new Date(),
         dateMustEnd: taskEndDate,
         description: description,
         dateEnded: null
      });
      cats[id].tasks = tasks;
      setCategories(cats);
      setCreateTaskIsOpen(false);
   }

   const handleSaveEditCategory = () => {
      if (categories == null) return;
      let cats = copyCategories(categories);
      cats[id].color = newColor;
      cats[id].description = newDescription;
      cats[id].title = newTitle;
      setCategories(cats);
      setOpenEdit(false);
   };

   // Component
   return (
      <>
         {/* Alert Dialog - Category Edit */}
         <AlertDialog
            isOpen={openEdit}
            leastDestructiveRef={cancelRef}
            onClose={() => setOpenEdit(false)}
         >
            <AlertDialogOverlay>
               <AlertDialogContent>
                  <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                     Edit {title}
                  </AlertDialogHeader>
                  <AlertDialogCloseButton />

                  <AlertDialogBody>
                     <CreateCategory
                        title={newTitle}
                        description={newDescription}
                        color={newColor}
                        setTitle={setNewTitle}
                        setDescription={setNewDescription}
                        setColor={setNewColor}
                     />
                  </AlertDialogBody>

                  <AlertDialogFooter>
                     <Button variant='primary' ref={cancelRef} onClick={handleSaveEditCategory}>
                        Save
                     </Button>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialogOverlay>
         </AlertDialog>

         {/* Alert Dialog - Category Info */}
         <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
         >
            <AlertDialogOverlay>
               <AlertDialogContent>
                  <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                     {title}
                  </AlertDialogHeader>
                  <AlertDialogCloseButton />

                  <AlertDialogBody>
                     {description}
                  </AlertDialogBody>

                  <AlertDialogFooter>
                     <Button variant='primary' ref={cancelRef} onClick={onClose}>
                        OK
                     </Button>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialogOverlay>
         </AlertDialog>

         {/* Alert Dialog - Create Task */}
         <AlertDialog
            isOpen={createTaskIsOpen}
            leastDestructiveRef={cancelRef}
            onClose={() => setCreateTaskIsOpen(false)}
         >
            <AlertDialogOverlay>
               <AlertDialogContent>
                  <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                     Create Task
                  </AlertDialogHeader>
                  <AlertDialogCloseButton />

                  <AlertDialogBody>
                     <InputInfo
                        title='Title'
                        placeholder='Task Title'
                        value={taskTitle}
                        type='text'
                        handler={setTaskTitle}
                     />
                     <InputInfo
                        title='Description'
                        placeholder='Task Description'
                        value={taskDescription}
                        type='text'
                        handler={setTaskDescription}
                     />
                     <InputInfo
                        value={undefined}
                        title='Deadline'
                        placeholder="Task Deadline"
                        type='datetime-local'
                        handler={handleSetDate}
                     />
                  </AlertDialogBody>

                  <AlertDialogFooter>
                     <Button variant='primary' onClick={handleCreateTask} ml={3}>
                        Create Task
                     </Button>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialogOverlay>
         </AlertDialog>

         <VStack
            minH='400px'
            maxH='400px'
            minW='600px'
            maxW='600px'
            borderRadius='10px'
            overflowY='scroll'
         >
            <HStack
               w='full'
               onMouseEnter={handleMouseEnter}
               onMouseLeave={handleMouseLeave}
            >
               {handleShowDragIcon()}
               <Box w='10px' />
               <Text
                  fontSize='30px'
                  fontWeight='bold'
               >
                  {title}
               </Text>
               <Spacer />
               <Button variant='info' bg={bgIconsButton} onClick={() => setCreateTaskIsOpen(true)}>
                  <EditIcon />
               </Button>
               <Button variant='info' bg={bgIconsButton} onClick={onOpen}>
                  <InfoIcon />
               </Button>
               <Button variant='secundary' onClick={() => setOpenEdit(true)}>
                  Edit
               </Button>
            </HStack>
            {
               tasks.map((task, idx) => {
                  return (
                     <VStack
                        w='full'
                        draggable
                        onDragStart={() => {
                           taskDraggable.current = idx
                        }}
                        onDragEnter={() => {
                           taskReplaced.current = idx;
                        }}
                        onDragEnd={handleDragOnEnd}
                     >
                        <Task
                           task={task}
                        />
                     </VStack>
                  )
               })
            }
            <Spacer />
         </VStack>
      </>
   );
}