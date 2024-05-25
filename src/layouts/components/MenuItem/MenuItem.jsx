import { TreeItem } from "@mui/x-tree-view";
import React from "react"
import { Link } from "react-router-dom";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box } from "@mui/material";
const MenuItem = ({ data, handleClick }) => {
  return (
    <TreeItem
      label={<Box sx={{
        display: "flex",
        justifyContent: data?.listProductCategoryChild.length > 0 ? "space-between" : "normal",
        alignItems: "center"
      }}>
        {data.title}
        {data?.listProductCategoryChild.length > 0 && <KeyboardArrowRightIcon></KeyboardArrowRightIcon>}
      </Box>}
      nodeId={`${data.title.toLowerCase()}`}
      sx={{
        "> .MuiTreeItem-content": {
          borderRadius: "5px",
          alignItems: "center",
          height: "100%",
          paddingTop: "5px",
          paddingBottom: "5px",
        },
      }}
      icon={<i className="icons-cate" style={{
        backgroundImage: `url(${data.icon})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        flex: 1,
      }}></i>}
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
              color: "var(--black)",
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
