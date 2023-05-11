
export const shakerSort = (arr: number[], reverse:boolean = false):number[] => {
  let left:number = 0;
  let right = arr.length - 1;
  let sorted:boolean = false;

  do {
    sorted = true;

    for (let i = left; i < right; i++) {
      if ((!reverse && arr[i+1] > arr[i]) || (reverse && arr[i-1] < arr[i])) {
        let saved = arr[i+1];
        arr[i+1] = arr[i];
        arr[i] = saved;
        sorted = false;
      }
    }
    right--;

    for (let i = right; i > left; i--) {
      if ((!reverse && arr[i-1] < arr[i]) || (reverse && arr[i-1] > arr[i])) {
        let saved = arr[i-1];
        arr[i-1] = arr[i];
        arr[i] = saved;
        sorted = false;
      }
    }
    left++;

    if (sorted) {
      break;
    }

  } while (left <= right);
  
  return arr;
};