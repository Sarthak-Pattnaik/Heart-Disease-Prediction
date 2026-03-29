from typing import Any

import numpy as np


def train_model(model: Any, X_train: np.ndarray, y_train: np.ndarray) -> Any:
    """
    Train a machine learning model on the provided dataset.

    Parameters
    ----------
    model : Any
        The machine learning model instance (e.g., scikit-learn estimator).
    X_train : np.ndarray
        Training feature matrix.
    y_train : np.ndarray
        Training target vector.

    Returns
    -------
    Any
        The trained model.

    Raises
    ------
    ValueError
        If training data is empty.
    """
    if X_train.size == 0 or y_train.size == 0:
        raise ValueError("Training data cannot be empty.")

    # Train the model
    model.fit(X_train, y_train)

    return model