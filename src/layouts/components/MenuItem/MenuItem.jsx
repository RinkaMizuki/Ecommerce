import { TreeItem } from "@mui/x-tree-view";
import React from "react"

const MenuItem = ({ data }) => {
  return (
    <TreeItem label={data.title} nodeId={data.id.toString()}>
        {data?.listProductCategoryChild.length > 0 && (
          data?.listProductCategoryChild.map((subCategory) => (
            <MenuItem key={subCategory.id} data={subCategory} />
          ))
        )}
    </TreeItem>
  )
};

export default MenuItem;
