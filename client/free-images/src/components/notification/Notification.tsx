interface Props {
  notificationInfo: null | { bootstrapColor: string; message: string };
}

const Notification = (props: Props) => {
  return (
    <>
      {props.notificationInfo && (
        <div
          className={"alert alert-" + props.notificationInfo.bootstrapColor}
          role="alert"
        >
          {props.notificationInfo.message}
        </div>
      )}
    </>
  );
};
export default Notification;
