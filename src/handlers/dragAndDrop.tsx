export const handleDragAndDrop = (idxDrag: number, idxDrop: number, arr: any[]): any[]  => {
    if (idxDrop > idxDrag) {
        return handleDropToBack(idxDrag, idxDrop, arr);
    }
    
    if (idxDrop < idxDrag) {
        return handleDropToFront(idxDrag, idxDrop, arr);
    }

    return arr;
}

export const handleDropToBack = (idxDrag: number, idxDrop: number, arr: any[]): any[] => {
    const taskDrag = arr[idxDrag];

    for (let i = idxDrag; i < (idxDrop - 1); i++) {
        arr[i] = arr[i+1];
    }

    arr[idxDrop-1] = taskDrag;

    return arr;
}

export const handleDropToFront = (idxDrag: number, idxDrop: number, arr: any[]): any[] => {
    const taskDrag = arr[idxDrag];

    for (let i = idxDrag; i > 0; i--) {
        arr[i] = arr[i-1];
    }

    arr[idxDrop] = taskDrag;

    return arr;
}