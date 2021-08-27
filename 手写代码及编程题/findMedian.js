const findMedian = (arr1, arr2) => {
    const midLen = (arr1.length + arr2.length + 1)/2;
    let i = j = 0;
    let res = [];
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] > arr2[j]) {
            res.push(arr2[j]);
            j++;
        } else {
            res.push(arr1[i]);
            i++;
        }
        if (res.length === midLen) return res.pop();
        if (res.length > midLen) return (res.pop() + res.pop())/2;
    }
    while (i < arr1.length) {
        res.push(arr1[i]);
        i++;
        if (res.length === midLen) return res.pop();
        if (res.length > midLen) return (res.pop() + res.pop())/2;
    }
    while (j < arr2.length) {
        res.push(arr2[j]);
        j++;
        if (res.length === midLen) return res.pop();
        if (res.length > midLen) return (res.pop() + res.pop())/2;
    }
}

nums1 = [1, 3]
nums2 = [2]
console.log(findMedian(nums1, nums2))

nums1 = [1, 2, 2.5]
nums2 = [4, 5, 9]
console.log(findMedian(nums1, nums2))