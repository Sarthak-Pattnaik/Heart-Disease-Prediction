from typing import Any, Dict

import numpy as np
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_curve,
    auc
)

# Module-level constant
POSITIVE_CLASS_INDEX = 1


def evaluate_model(
    model: Any,
    X_test: np.ndarray,
    y_test: np.ndarray
) -> Dict[str, Any]:
    """
    Evaluate a trained model using standard classification metrics.

    Parameters
    ----------
    model : Any
        Trained machine learning model.
    X_test : np.ndarray
        Test feature matrix.
    y_test : np.ndarray
        True labels for test data.

    Returns
    -------
    dict
        Dictionary containing predictions, probabilities, and evaluation metrics.

    Raises
    ------
    AttributeError
        If the model does not support probability prediction.
    ValueError
        If test data is empty.
    """
    if X_test.size == 0 or y_test.size == 0:
        raise ValueError("Test data cannot be empty.")

    # Generate predictions
    y_pred = model.predict(X_test)

    # Check if model supports probability estimates
    if not hasattr(model, "predict_proba"):
        raise AttributeError("Model does not support probability predictions.")

    y_probs = model.predict_proba(X_test)[:, POSITIVE_CLASS_INDEX]

    # Compute metrics
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)
    cm = confusion_matrix(y_test, y_pred)

    # ROC metrics
    fpr, tpr, thresholds = roc_curve(y_test, y_probs)
    roc_auc = auc(fpr, tpr)

    return {
        "y_pred": y_pred,
        "y_probs": y_probs,
        "accuracy": accuracy,
        "report": report,
        "confusion_matrix": cm,
        "fpr": fpr,
        "tpr": tpr,
        "thresholds": thresholds,
        "roc_auc": roc_auc
    }