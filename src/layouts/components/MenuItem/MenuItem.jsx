import { TreeItem } from "@mui/x-tree-view";
import React from "react"
import { Link } from "react-router-dom";

const MenuItem = ({ data, handleClick }) => {
  return (
    <TreeItem label={data.title} nodeId={`${data.title.toLowerCase()}`} sx={{
      "> .MuiTreeItem-content": {
        borderRadius: "5px"
      }
    }}
      onClick={handleClick}
    >
      {data?.listProductCategoryChild.length > 0 && (
        data?.listProductCategoryChild.map((subCategory) => (
          <Link
            key={subCategory.id}
            to={{
              pathname: `/category/${subCategory.title}`
            }}
            style={{
              textDecoration: "none",
              color: "var(--black)"
            }}
            state={{
              categoryTitle: subCategory.title.toLowerCase(),
              parentCategoryTitle: data.title.toLowerCase(),
            }}
          >
            <MenuItem data={subCategory} />
          </Link>
        ))
      )}
    </TreeItem>
  )
};

export default MenuItem;
