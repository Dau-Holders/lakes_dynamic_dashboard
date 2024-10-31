import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface DeleteConfirmationModalProps {
  visible: boolean;
  onHide: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteConfirmationModal({
  visible,
  onHide,
  onConfirm,
  loading = false,
}: DeleteConfirmationModalProps) {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Confirm Delete"
      modal
      footer={
        <div>
          <Button
            label="No"
            icon="pi pi-times"
            onClick={onHide}
            className="p-button-text"
          />
          <Button
            label="Yes"
            icon="pi pi-check"
            onClick={onConfirm}
            loading={loading}
            className="p-button-danger"
          />
        </div>
      }
    >
      <div className="flex align-items-center justify-content-center">
        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
        <span>Are you sure you want to delete this item?</span>
      </div>
    </Dialog>
  );
}
