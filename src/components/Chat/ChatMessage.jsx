import { forwardRef, useCallback, useEffect, useState } from "react";
import ChatReaction from "./ChatReaction";
import { Controlled as ControlledZoom } from "react-medium-image-zoom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-medium-image-zoom/dist/styles.css";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { MESSAGE_TYPE } from "./ChatBody";
import TooltipTime from "./TooltipTime";
import { Avatar, Box } from "@mui/material";

const ChatMessage = forwardRef(
  ({ msg, index, totalMessage, userLogin }, ref) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [imgUrl, setImgUrl] = useState("");

    const handleZoomChange = useCallback((shouldZoom) => {
      setIsZoomed(shouldZoom);
    }, []);

    useEffect(() => {
      if (isZoomed) {
        const imgContainerElm = document.querySelector(
          "dialog[open] div[data-rmiz-modal-content]"
        );
        const convertedUrl = imgUrl.replace(/ /g, "%20");
        imgContainerElm.style.setProperty("--bg", `url(${convertedUrl})`);
      }
    }, [isZoomed, imgUrl]);

    return userLogin?.id === msg.senderId ? (
      <div
        className="d-flex flex-row justify-content-end mb-3 mt-3 pt-1"
        key={msg.messageId}
        ref={index === totalMessage - 1 ? ref : null}
      >
        <TooltipTime date={msg?.sendAt}>
          <div
            style={{
              maxWidth: "240px",
            }}
          >
            <p
              className="small me-2 text-white rounded-3 bg-primary p-2"
              style={{
                lineHeight: "1.4",
                marginTop: "2px",
              }}
            >
              {msg.messageContent}
            </p>
          </div>
        </TooltipTime>
        <Avatar src={msg.sender?.url} alt={msg.sender?.avatar} />
      </div>
    ) : (
      <div
        className="d-flex flex-row justify-content-start pt-2 align-items-end"
        key={msg.messageId}
        ref={index === totalMessage - 1 ? ref : null}
      >
        <Avatar src={msg.sender?.url} alt={msg.sender?.avatar} />
        <TooltipTime date={msg?.sendAt} position="right">
          <Box>
            <ChatMessageImage
              senderId={msg.senderId}
              messageType={msg.messageType}
              messageId={msg.messageId}
              currentUser={userLogin}
              messageContent={msg.messageContent}
              handleZoomChange={handleZoomChange}
              isZoomed={isZoomed}
              setImgUrl={setImgUrl}
              reactions={msg.reactions}
            />
          </Box>
        </TooltipTime>
      </div>
    );
  }
);

const ChatMessageImage = forwardRef(
  (
    {
      senderId,
      messageId,
      messageType,
      messageContent,
      handleZoomChange,
      currentUser,
      isZoomed,
      setImgUrl,
      reactions,
    },
    ref = null
  ) => {
    return (
      <>
        {messageType === MESSAGE_TYPE.TEXT ? (
          <p
            data={senderId === currentUser.id ? "admin" : "user"}
            id={messageId}
            className="small p-2 mb-1 text-white rounded-3 bg-primary"
            style={{
              whiteSpace: "pre-wrap",
              marginLeft: "8px",
            }}
            ref={ref}
          >
            {messageContent}
          </p>
        ) : messageType === MESSAGE_TYPE.AUDIO ? (
          <audio
            ref={ref}
            id={messageId}
            data={senderId === currentUser.id ? "admin" : "user"}
            src={`data:audio/wav;base64,${messageContent}`}
            controls
            style={{
              marginLeft: "8px",
              borderRadius: "20px",
              marginRight: "15px",
              width: "250px",
              height: "41px",
            }}
          />
        ) : messageType === MESSAGE_TYPE.VIDEO ? (
          <video
            ref={ref}
            id={messageId}
            data={senderId === currentUser.id ? "admin" : "user"}
            src={messageContent}
            controls
            style={{
              marginLeft: "8px",
              cursor: "pointer",
              border: "1px solid #232323",
              overflow: "hidden",
              marginRight: "15px",
              borderRadius: "20px",
              maxWidth: "200px",
              height: "100%",
            }}
          />
        ) : (
          <ControlledZoom
            IconUnzoom={ZoomOutMapIcon}
            onZoomChange={(shouldZoom) => {
              handleZoomChange(shouldZoom);
              setImgUrl(messageContent);
            }}
            isZoomed={isZoomed}
          >
            <div ref={ref} id={messageId}>
              <LazyLoadImage
                visibleByDefault={true}
                data={senderId === currentUser.id ? "admin" : "user"}
                effect="blur"
                className="me-3 message-image"
                src={`${messageContent}`}
                style={{
                  marginLeft: "8px",
                  cursor: "pointer",
                  overflow: "hidden",
                  borderRadius: "20px",
                  maxWidth: "200px",
                  height: "100%",
                  objectFit: "fill",
                }}
              />
            </div>
          </ControlledZoom>
        )}

        <ChatReaction reactions={reactions} type={messageType} />
      </>
    );
  }
);

export default ChatMessage;
